using Api.Services;
using Api.Services.Verification;
using Api.Utils;
using Xunit.Abstractions;

namespace Api.UnitTests.Utils;

public class VerificationServiceTests(ITestOutputHelper testOutputHelper)
{
	[Fact]
	public void Generate_ShouldGenerateDigitsOnly()
	{
		throw new NotImplementedException();
		
		/*var code = VerificationService.GenerateCode();
		testOutputHelper.WriteLine($"Generated code: {code}");
		Assert.Matches("^[0-9]+$", code);*/
	}

}