namespace Api.Services.Email;

public interface IEmailService
{
	public Task<bool> Send(string recipientEmail, string recipientName, string msgSubject, string msgBody);
}