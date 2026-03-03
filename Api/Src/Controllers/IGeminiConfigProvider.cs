using Google.GenAI.Types;

namespace Api.Controllers;

public interface IGeminiConfigProvider
{
	public GenerateContentConfig Config { get; }
	public string ApiKey { get; }
	public string Model { get; }
}