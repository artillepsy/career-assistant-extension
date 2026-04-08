using System.Security.Cryptography;
using System.Text;

namespace Api.Utils;

public interface IVerificationService
{
	public string GenerateCode();

	public byte[] HashCode(string code);
}