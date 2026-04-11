using Api.Controllers;
using Api.Controllers.Users;
using Api.Extensions;
using Api.Services.Email;
using Api.Services.Password;
using Api.Services.Verification;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.SetupAppDbContext();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.SetupSwaggerAuthentication();

builder.Services.AddScoped<IGeminiConfigProvider, GeminiConfigProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IVerifService, VerifService>();
builder.Services.AddScoped<IEmailService, EmailDevService>();

builder.Services.Configure<VerifOptions>(builder.Configuration.GetSection("UserVerification"));

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("test", () => "test");

app.Run();
