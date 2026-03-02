using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class ChatbotController : ControllerBase
{
	public class MessageDto
	{
		public string Message { get; set; } = string.Empty;
	}
	
	[HttpPost("response")]
	public ActionResult<string> GetResponse([FromBody] MessageDto dto)
	{
		return $"Hello, there's your message: {dto.Message}";
	}
}