using System.Text.Json;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Api.Controllers;

//todo: skip authorize for tests now
//[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
	private readonly ILogger<AnalysisController> _logger;
	private readonly IGeminiConfigProvider _geminiProvider;
	
	public class JobAnalysisDto
	{
		[JsonProperty("pageText")]
		public string PageText { get; set; } = string.Empty;
		[JsonProperty("cv")]
		public string Cv { get; set; } = string.Empty;
	}

	public AnalysisController(IGeminiConfigProvider geminiProvider, ILogger<AnalysisController> logger)
	{
		_geminiProvider = geminiProvider;
		_logger = logger;
	}
	
	[HttpPost("analyze-job")]
	public async Task<ActionResult> AnalyzeJob([FromBody] JobAnalysisDto dto)
	{
		if (string.IsNullOrEmpty(dto.PageText))
		{
			return BadRequest("Property [pageText] is empty");
		}
		
		var prompt = _geminiProvider.PromptStart + dto.PageText;
		var startTime = DateTime.Now;
		var client = new Client(apiKey: _geminiProvider.ApiKey);

		GenerateContentResponse response;

		try
		{
			response = await client.Models.GenerateContentAsync(
				model: _geminiProvider.Model,
				contents: prompt,
				config: _geminiProvider.Config);
		}
		catch (Exception e)
		{
			return Problem(detail: e.Message);
		}
		
		var timeTaken = DateTime.Now - startTime;
		var analysis = response.Candidates[0].Content.Parts[0].Text;
		
		_logger.LogInformation(analysis);
		
		return Ok(new
		{
			timeTaken = timeTaken.TotalSeconds,
			characters =  analysis.Length,
			aiModel = _geminiProvider.Model,
			analysis = JsonDocument.Parse(analysis)
		});
	}
}