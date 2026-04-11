using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Api.Services.Email;

public class EmailDevService(
	IConfiguration config,
	ILogger<EmailDevService> logger) : IEmailService
{
	private readonly string _senderEmail = config["DevMailAddress"] ?? throw new ArgumentNullException();
	private readonly string _senderPassword = config["DevMailAppPassword"] ?? throw new ArgumentNullException();
	
	public async Task<bool> Send(string recipientEmail, string recipientName, string msgSubject, string msgBody)
	{
		var message = new MimeMessage();
		message.From.Add(new MailboxAddress("Artillepsy", _senderEmail));
		message.To.Add(new MailboxAddress(recipientName, recipientEmail));
		message.Subject = msgSubject;
		message.Body = new TextPart("plain")
		{
			Text = msgBody
		};

		using var client = new SmtpClient();

		try
		{
			await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
			await client.AuthenticateAsync(_senderEmail, _senderPassword);
			await client.SendAsync(message);
			await client.DisconnectAsync(true);
		}
		catch (Exception e)
		{
			logger.LogError(e, $"Failed to send email to recipient: {recipientEmail}");
			return false;
		}

		return true;
	}
}