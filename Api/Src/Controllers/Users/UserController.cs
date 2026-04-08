using System.ComponentModel.DataAnnotations;
using Api.Data;
using Api.Data.Entities;
using Api.Services.Password;
using Api.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers.Users;

//todo: right now it's a simple CRUD controller. Modify later.
[ApiController]
[Route("api/[controller]")]
public class UserController(
	AppDbContext dbContext, 
	PasswordService passwordService, 
	IVerificationService verificationService, 
	ILogger<UserController> logger) : ControllerBase
{
	public class RequestVerificationCodeDto
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

	public class VerificationDto
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
		
		[StringLength(6, MinimumLength = 6)]
		[Required(AllowEmptyStrings = false)]
		
		public string Code { get; set; }
	}
		
	//todo: check a case when user already exists and they request a code again
	[HttpPost("request-verification-code")]
	public async Task<ActionResult> RequestVerificationCode([FromBody] RequestVerificationCodeDto dto)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}
		
		var emailFormatted = dto.Email.ToLowerInvariant();
		var hashedPassword = passwordService.Hash(dto.Password);
		
		var exists = await dbContext.PendingUsers.AnyAsync(u => u.Email.Equals(emailFormatted));
		
		if (exists) // well, if exists, the new code will be generated and sent to email then. To fix it
		{
			return Conflict("User with same email already exists");
		}

		var verificationCode = verificationService.GenerateCode();
		
		try
		{
			await dbContext.PendingUsers.AddAsync(new PendingUser()
			{
				Name = dto.Name,
				Email = emailFormatted,
				PasswordHash = hashedPassword,
				// store hashcode instead of raw value for security
				VerificationCodeHash = verificationService.HashCode(verificationCode),
				LastModifiedAt = DateTimeOffset.UtcNow,
				ExpiresAt = DateTimeOffset.UtcNow + TimeSpan.FromMinutes(15)
			});

			await dbContext.SaveChangesAsync();
		}
		catch (Exception e)
		{
			logger.LogError(e.ToString());
			return Problem("Internal server error.");
		}
		// todo: sent an email with the code. Locally - through a designed email address for that. In prod - use AWS SES.
		// basically, it's better to use email  service

		logger.LogInformation($"Verification code is stored and sent to email. Code: {verificationCode}");
		return Ok("Verification code is sent to your email!");
	}
}