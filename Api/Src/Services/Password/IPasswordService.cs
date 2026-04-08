namespace Api.Services.Password;

public interface IPasswordService
{
	public string Hash(string password);
}