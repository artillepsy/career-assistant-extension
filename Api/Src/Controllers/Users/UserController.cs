using System.ComponentModel.DataAnnotations;
using Api.Data;
using Api.Data.Entities;
using Api.Data.Hashing;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers.Users;

//todo: right now it's a simple CRUD controller. Modify later.
[ApiController]
[Route("api/[controller]")]
public class UserController(
	AppDbContext dbContext, 
	IPasswordHasher<UserCredentials> passwordHasher, 
	ILogger<UserController> logger) : ControllerBase
{
	private readonly AppDbContext _dbContext = dbContext;
	private readonly IPasswordHasher<UserCredentials> _passwordHasher = passwordHasher;
	private readonly ILogger<UserController> _logger = logger;

	public class RequestVerificationDto
	{
		[Required(AllowEmptyStrings = false)]
		[StringLength(20, MinimumLength = 3)]
		[RegularExpression(@"^[a-zA-Z0-9_]+$")]
		public string Name { get; set; }
		
		[EmailAddress]
		[Required(AllowEmptyStrings = false)]
		[StringLength(254, MinimumLength = 6)]
		public string Email { get; set; }
		
		[Required(AllowEmptyStrings = false)]
		[StringLength(50, MinimumLength = 8)]
		public string Password { get; set; }
	}
		
	//todo: check a case when user already exists and they request a code again
	[HttpPost("request-verification-code")]
	public async Task<ActionResult> RequestVerificationCode([FromBody] RequestVerificationDto dto)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}
		
		var emailFormatted = dto.Email.ToLowerInvariant();
		
		var exists = await _dbContext.PendingUsers.AnyAsync(u => u.Email.Equals(emailFormatted));
		if (exists)
		{
			return Conflict("User with same email already exists");
		}

		var credentials = new UserCredentials() { Email = emailFormatted, Password = dto.Password };
		var hashedPassword = _passwordHasher.HashPassword(credentials, dto.Password);
		
		try
		{
			await _dbContext.PendingUsers.AddAsync(new PendingUser()
			{
				Name = dto.Name,
				Email = emailFormatted,
				PasswordHash = hashedPassword
			});

			await _dbContext.SaveChangesAsync();
		}
		catch (Exception e)
		{
			_logger.LogError(e.ToString());
			return Problem("Internal server error.");
		}

		return Ok("Verification code is sent to your email!");
	}
}