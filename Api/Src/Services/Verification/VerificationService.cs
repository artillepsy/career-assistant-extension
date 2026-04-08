using System.Security.Cryptography;
using System.Text;
using Api.Utils;

namespace Api.Services.Verification;

public class VerificationService : IVerificationService
{
	public string GenerateCode()
	{
		var str = new StringBuilder(6);

		for (int i = 0; i < 6; i++)
		{
			str.Append(RandomNumberGenerator.GetInt32(0, 10).ToString());
		}
		return str.ToString();
	}

	public byte[] HashCode(string code)
	{
		var bytes = Encoding.UTF8.GetBytes(code);
		var hash = SHA256.HashData(bytes);
		return hash;
	}
}