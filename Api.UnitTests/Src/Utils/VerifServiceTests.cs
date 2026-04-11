using Api.Services.Verification;
using Xunit.Abstractions;

namespace Api.UnitTests.Utils;

public class VerifServiceTests(ITestOutputHelper testOutputHelper)
{
	private readonly VerifService _verifService = new();

	[Fact]
	public void GenerateCode_GeneratesRandomCode_ShouldGenerateDigitsOnly()
	{
		var code = _verifService.GenerateCode();
		testOutputHelper.WriteLine($"Generated code: {code}");
		Assert.Matches("^[0-9]+$", code);
	}
}