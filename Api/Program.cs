using Api.Controllers;
using Api.Data.Entities;
using Api.Data.Hashing;
using Api.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.SetupAppDbContext();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.SetupSwaggerAuthentication();

builder.Services.AddScoped<IGeminiConfigProvider, GeminiConfigProvider>();
builder.Services.AddScoped<IPasswordHasher<UserCredentials>, PasswordHasher<UserCredentials>>();

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
