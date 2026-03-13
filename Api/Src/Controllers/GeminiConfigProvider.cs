using Google.GenAI.Types;
using File = System.IO.File;
using Type = Google.GenAI.Types.Type;

namespace Api.Controllers;

public class GeminiConfigProvider : IGeminiConfigProvider
{
	public GenerateContentConfig Config { get; }
	public string ApiKey { get; }
	public string Model { get; }
	public string PromptStart { get; }
	
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
		
		var baseDir = AppDomain.CurrentDomain.BaseDirectory;
		var filePath = Path.Combine(baseDir, "prompt.txt");

		if (!File.Exists(filePath))
		{
			throw new FileNotFoundException($"Prompt file missing at: {filePath}");
		}
		
		PromptStart = File.ReadAllText(filePath);
		ApiKey = configuration["GEMINI_API_KEY"] ?? throw new ArgumentNullException();
		Model = configuration["Gemini:Model"] ?? throw new ArgumentNullException();
		
		Console.WriteLine($"Prompt start: {PromptStart}");
		
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
			ResponseMimeType = "application/json",
			
			ResponseSchema = new Schema()
			{
				Type = Type.Object,
				Properties = new Dictionary<string, Schema>()
				{
					["jobTitle"] = new Schema() {Type = Type.String},
					["company"] = new Schema() {Type = Type.String},
					["predictedSalary"] = new Schema() {Type = Type.String},
					["requiredSkills"] = new Schema()
					{
						Type = Type.Array,
						Items = new Schema() {Type = Type.String}
					},
					["redFlags"] = new Schema()
					{
						Type = Type.Array,
						Items = new Schema() {Type = Type.String}
					},
					["coverLetter"] = new Schema() {Type = Type.String},
				},
				Required = ["jobTitle", "company", "requiredSkills", "coverLetter"]
			}
		};
	}
}