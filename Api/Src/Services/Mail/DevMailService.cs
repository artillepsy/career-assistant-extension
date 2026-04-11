using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Api.Services.Mail;

public class DevMailService(
	IOptions<DevMailOptions> options,
	ILogger<DevMailService> logger) : IMailService
{
	private readonly DevMailOptions _options = options.Value;
	
	public async Task<bool> Send(string recipientAddress, string recipientName, string msgSubject, string msgBody)
	{
		var message = new MimeMessage();
		message.From.Add(new MailboxAddress(_options.SenderName, _options.SenderAddress));
		message.To.Add(new MailboxAddress(recipientName, recipientAddress));
		message.Subject = msgSubject;
		message.Body = new TextPart("plain")
		{
			Text = msgBody
		};

		using var client = new SmtpClient();

		try
		{
			await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
			await client.AuthenticateAsync(_options.SenderAddress, _options.SenderPassword);
			await client.SendAsync(message);
			await client.DisconnectAsync(true);
		}
		catch (Exception e)
		{
			logger.LogError(e, $"Failed to send email to recipient: {recipientAddress}");
			return false;
		}

		return true;
	}
}