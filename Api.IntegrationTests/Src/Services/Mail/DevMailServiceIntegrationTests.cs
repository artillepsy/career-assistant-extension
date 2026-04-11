using Api.Services.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit.Abstractions;

namespace Api.IntegrationTests.Services.Mail;

public class DevMailServiceIntegrationTests
{
	private readonly ITestOutputHelper _testOutputHelper;
	private readonly DevMailService _service;
	private readonly string _recipientAddress;
	
	public DevMailServiceIntegrationTests(ITestOutputHelper testOutputHelper)
	{
		_testOutputHelper = testOutputHelper;
		
		var logger = new Mock<ILogger<DevMailService>>();
		var configuration = new ConfigurationBuilder()
			.AddUserSecrets("b702715b-a6a9-4688-8093-be4d901b5bed")
			.Build();

		var section = configuration.GetSection("DevMail");

		var options = new DevMailOptions();
		section.Bind(options);

		_recipientAddress = section["RecipientAddress"] ?? throw new ArgumentNullException();
		
		_testOutputHelper.WriteLine($"recipient address: {_recipientAddress}");
		_testOutputHelper.WriteLine($"sender address: {options.SenderAddress}");
		_testOutputHelper.WriteLine($"sender name: {options.SenderName}");

		_service = new DevMailService(Options.Create(options), logger.Object);
	}
	
	[Fact(/*Skip = "Run manually to verify credentials"*/)]
	public async Task Send_SendsMailToRecipient_ShouldSendCorrectly()
	{
		var result = await _service.Send(
			_recipientAddress, 
			"Test Name", 
			"Test Subject",
			"Test Body");
		
		Assert.True(result);
	}
}