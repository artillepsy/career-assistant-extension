using Google.GenAI.Types;

namespace Api.Controllers;

public class GeminiConfigProvider : IGeminiConfigProvider
{
	public GenerateContentConfig Config { get; }
	public string ApiKey { get; }
	public string Model { get; }
	
	public GeminiConfigProvider(IConfiguration configuration)
	{
		var configSection = configuration.GetSection("Gemini:Config") ?? throw new ArgumentNullException();
		var instructionsSection = configSection.GetSection("SystemInstructions") ?? throw new ArgumentNullException();
		var instructions = instructionsSection.Get<string[]>() ?? throw new ArgumentNullException();
		var parts = instructions.Select(instruction => new Part() { Text = instruction }).ToList();
		var tools = new List<Tool>();
		
		if (configSection.GetValue<bool>("IsGoogleSearchOn"))
		{
			tools.Add(new Tool {GoogleSearch = new GoogleSearch()});
		}
		
		Config = new GenerateContentConfig
		{
			SystemInstruction = new Content
			{
				Parts = parts
			},
			Temperature = configSection.GetValue<double>("Temperature"),
			MaxOutputTokens = configSection.GetValue<int>("MaxOutputTokens"),
			CandidateCount = configSection.GetValue<int>("CandidateCount"),
			Tools = tools,
		};
		
		ApiKey = configuration["GEMINI_API_KEY"] ?? throw new ArgumentNullException();
		Model = configuration["Gemini:Model"] ?? throw new ArgumentNullException();
	}
}