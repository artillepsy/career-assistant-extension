using Microsoft.OpenApi;

namespace Api.Extensions;

/// <summary>
/// Collection of extensions for builder services.
/// </summary>
public static class BuilderServicesExtensions
{
	/// <summary>
	/// Custom extension. Adds support of JWT Authentication the swagger view to testing.
	/// </summary>
	public static void SetupSwaggerAuthentication(this IServiceCollection services)
	{
		services.AddSwaggerGen(options =>
		{
			options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
			{
				Type = SecuritySchemeType.Http,
				Scheme = "bearer",
				BearerFormat = "JWT",
				Description = "JWT Authorization header using the Bearer scheme."
			});
			options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
			{
				[new OpenApiSecuritySchemeReference("bearer", document)] = []
			});
		});
		
	}
}