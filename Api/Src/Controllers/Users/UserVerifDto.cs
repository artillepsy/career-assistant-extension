using System.ComponentModel.DataAnnotations;

namespace Api.Controllers.Users;

public class UserVerifDto
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

	[Required(AllowEmptyStrings = false)]
	[StringLength(6, MinimumLength = 6)]
	[RegularExpression(@"^[0-9]+$")]
	public string Code { get; set; }
}