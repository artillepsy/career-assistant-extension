using System.Security.Cryptography;

namespace Api.Services.Verification;

public class VerifService : IVerifService
{
	public string GenerateCode()
	{
		return RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
	}

	public bool Verify(string codeA, string codeB)
	{
		return codeA.Equals(codeB);
	}

}