using System.Text.Json;
using Google.GenAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
		[JsonProperty("pageText")]
		public string PageText { get; set; } = string.Empty;
		[JsonProperty("cv")]
		public string Cv { get; set; } = string.Empty;
	}

	public PromptsController(IGeminiConfigProvider geminiProvider, ILogger<PromptsController> logger)
	{
		_geminiProvider = geminiProvider;
		_logger = logger;
	}
	
	[HttpPost("generate")]
	public async Task<ActionResult> Generate([FromBody] PromptDto dto)
	{
		if (string.IsNullOrEmpty(dto.PageText))
		{
			return BadRequest("Property [PageText] is empty");
		}
		
		var prompt = _geminiProvider.PromptStart + dto.PageText;
		
		var startTime = DateTime.Now;
		
		var client = new Client(apiKey: _geminiProvider.ApiKey);
		var response = await client.Models.GenerateContentAsync(
			model: _geminiProvider.Model,
			contents: prompt, 
			config: _geminiProvider.Config);
		
		var timeTaken = DateTime.Now - startTime;

		var jsonResponse = response.Candidates[0].Content.Parts[0].Text;
		
		_logger.LogInformation(jsonResponse);
		return Ok(new
		{
			timeTaken = timeTaken.TotalSeconds,
			characters =  jsonResponse.Length,
			aiModel = _geminiProvider.Model,
			response = JsonDocument.Parse(jsonResponse)
		});
	}
}