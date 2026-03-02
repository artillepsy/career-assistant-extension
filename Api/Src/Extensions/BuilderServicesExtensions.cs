
using Microsoft.OpenApi;

namespace Api.Extensions;

public static class BuilderServicesExtensions
{
	public static void SetupSwaggerBehaviour(this IServiceCollection services)
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