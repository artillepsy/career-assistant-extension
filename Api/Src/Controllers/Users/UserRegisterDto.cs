using System.ComponentModel.DataAnnotations;

namespace Api.Controllers.Users;

public class UserRegisterDto
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
	[StringLength(50, MinimumLength = 12)]
	public string Password { get; set; }
}