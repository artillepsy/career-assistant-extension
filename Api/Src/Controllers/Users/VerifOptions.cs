namespace Api.Controllers.Users;

public class VerifOptions
{
	/// <summary>
	/// The expiration time of verification code in minutes.
	/// </summary>
	public int VerifCodeTimeLeft { get; set; }
	
	/// <summary>
	/// The number of verification attempts left for current code.
	/// </summary>
	public int VerifAttemptsLeft { get; set; }
}