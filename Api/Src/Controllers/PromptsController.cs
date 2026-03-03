using Google.GenAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

//todo: skip authorize for tests now
//[Authorize] 
[ApiController]
[Route("[controller]")]
public class PromptsController : ControllerBase
{
	private readonly ILogger<PromptsController> _logger;
	private readonly IGeminiConfigProvider _geminiProvider;
	
	public class PromptDto
	{
		public string Prompt { get; set; } = string.Empty;
	}

	public PromptsController(IGeminiConfigProvider geminiProvider, ILogger<PromptsController> logger)
	{
		_geminiProvider = geminiProvider;
		_logger = logger;
	}
	
	[HttpPost("generate")]
	public async Task<ActionResult<string>> Generate([FromBody] PromptDto dto)
	{
		var startTime = DateTime.Now;
		
		var client = new Client(apiKey: _geminiProvider.ApiKey);
		var response = await client.Models.GenerateContentAsync(
			model: _geminiProvider.Model,
			contents: dto.Prompt, 
			config: _geminiProvider.Config);
		
		var timeTaken = DateTime.Now - startTime;

		var responseText = response.Candidates[0].Content.Parts[0].Text;

		_logger.LogInformation(responseText);
		return 
			$"Time taken: {timeTaken.TotalSeconds} s.\n" +
		       $"Characters: {responseText.Length}.\n" +
		       $"Response: {responseText}";
	}
}