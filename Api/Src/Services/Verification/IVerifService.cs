namespace Api.Services.Verification;

public interface IVerifService
{
	public string GenerateCode();
	public bool Verify(string codeA, string codeB);
}