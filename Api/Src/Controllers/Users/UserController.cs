using Api.Data;
using Api.Data.Entities;
using Api.Services.Mail;
using Api.Services.Password;
using Api.Services.Verification;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Controllers.Users;

//todo: if there are several failed attempts in N minutes, block account for Y mins.
[ApiController]
[Route("api/[controller]")]
public class UserController(
	AppDbContext dbContext,
	IMailService mailService,
	IPasswordHasher passwordHasher,
	IVerifService verifService,
	IOptions<VerifOptions> options,
	ILogger<UserController> logger) : ControllerBase
{
	private readonly VerifOptions _options = options.Value;

	[HttpPost("register")]
	public async Task<ActionResult> Register([FromBody] UserRegisterDto dto)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		dto.Email = dto.Email.Trim().ToLowerInvariant();
		
		if (await IsUserRegistered(dto.Email))
		{
			return Conflict("The email is already in use");
		}

		var verifCode = verifService.GenerateCode();
		
		try
		{
			var pendingUser = await dbContext.PendingUsers.FirstOrDefaultAsync(u => u.Email == dto.Email);

			if (pendingUser == null)
			{
				await dbContext.PendingUsers.AddAsync(new PendingUser()
				{
					Name = dto.Name,
					Email = dto.Email,
					PasswordHash = passwordHasher.Hash(dto.Password),
					VerificationCode = verifCode,
					VerifyAttemptsLeft = _options.VerifAttemptsLeft,
					LastModifiedAt = DateTimeOffset.UtcNow,
					ExpiresAt = DateTimeOffset.UtcNow + TimeSpan.FromMinutes(_options.VerifCodeTimeLeft)
				});
			}
			else
			{
				pendingUser.Name = dto.Name;
				pendingUser.Email = dto.Email;
				pendingUser.PasswordHash = passwordHasher.Hash(dto.Password);
				pendingUser.VerificationCode = verifCode;
				pendingUser.VerifyAttemptsLeft = _options.VerifAttemptsLeft;
				pendingUser.LastModifiedAt = DateTimeOffset.UtcNow;
				pendingUser.ExpiresAt = DateTimeOffset.UtcNow + TimeSpan.FromMinutes(_options.VerifCodeTimeLeft);
			}

			await dbContext.SaveChangesAsync();
		}
		catch (Exception e)
		{
			logger.LogError(e.ToString());
			return Problem("Internal server error.");
		}

		// todo: send an email with the code. Locally - through a designed email address for that. In prod - use AWS SES.
		var result = await mailService.Send(
			dto.Email, 
			dto.Name,
			"Verification",
			verifCode);

		if (!result)
		{
			return Accepted("Server error occured while sending the mail. Try again.");
		}
		
		// todo: remove code log from prod
		logger.LogInformation($"Verification code is stored and sent to email: {dto.Email}. Code: {verifCode}");
		return Ok("Verification code is sent to your email!");
	}

	[HttpPost("verify")]
	public async Task<ActionResult> Verify([FromBody] UserVerifDto dto)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		dto.Email = dto.Email.Trim().ToLowerInvariant();

		if (await IsUserRegistered(dto.Email))
		{
			return Conflict("The user is already registered.");
		}
		
		var pendingUser = await dbContext.PendingUsers.FirstOrDefaultAsync(u => u.Email == dto.Email);

		if (pendingUser == null)
		{
			return NotFound("The user doesn't exist.");
		}

		if (!passwordHasher.Verify(dto.Password, pendingUser.PasswordHash))
		{
			return Unauthorized("Invalid credentials");
		}

		if (pendingUser.VerifyAttemptsLeft <= 0)
		{
			return BadRequest("Too many failed attempts.");
		}

		if (pendingUser.ExpiresAt < DateTimeOffset.UtcNow)
		{
			return BadRequest("The code is expired.");
		}

		if (!verifService.Verify(dto.Code, pendingUser.VerificationCode))
		{
			pendingUser.VerifyAttemptsLeft--;
			await dbContext.SaveChangesAsync();
			return BadRequest($"Invalid code. Attempts left: {pendingUser.VerifyAttemptsLeft}.");
		}

		await using var transaction = await dbContext.Database.BeginTransactionAsync();
		try
		{
			await dbContext.Users.AddAsync(new User()
			{
				Name = pendingUser.Name,
				Email = pendingUser.Email,
				PasswordHash = pendingUser.PasswordHash
			});
			dbContext.PendingUsers.Remove(pendingUser);
			
			await dbContext.SaveChangesAsync();
			await transaction.CommitAsync();

			return Ok("Registration is completed!");
		}
		catch (Exception e)
		{
			await transaction.RollbackAsync();
			logger.LogError(e.ToString());
			return Problem("Internal server error.");
		}
	}
	
	private async Task<bool> IsUserRegistered(string email)
	{
		return await dbContext.Users.AsNoTracking().AnyAsync(u => u.Email == email);
	}
}