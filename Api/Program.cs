using Api.Controllers;
using Api.Extensions;
using Api.Services.Email;
using Api.Services.Password;
using Api.Services.Verification;
using Api.Utils;
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
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IVerificationService, VerificationService>();
builder.Services.AddScoped<IEmailService, EmailDevService>();


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
