using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Extensions;

public static class WebApplicationBuilderExtensions
{
	/// <summary>
	/// Custom Extension. Adds App Db Context to the app; resolves DB connection string.
	/// </summary>
	public static void SetupAppDbContext(this WebApplicationBuilder builder)
	{
		var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
		                       throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
		builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connectionString));
	}
}