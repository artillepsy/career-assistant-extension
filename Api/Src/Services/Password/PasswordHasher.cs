namespace Api.Services.Password;


public class PasswordHasher : IPasswordHasher
{
	public string Hash(string password)
	{
		var hash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);
		return hash;
	}

	public bool Verify(string password, string hashedPassword)
	{
		return BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
	}
	
	//todo: add rehash logic if needed for logged in users
}