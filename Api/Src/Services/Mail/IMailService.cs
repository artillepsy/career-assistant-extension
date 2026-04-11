namespace Api.Services.Mail;

public interface IMailService
{
	public Task<bool> Send(
		string recipientAddress, 
		string recipientName, 
		string msgSubject, 
		string msgBody);
}