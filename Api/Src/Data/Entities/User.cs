using Api.Data.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Api.Data.Entities;

[EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
public class User
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string Email { get; set; }
	public string Password { get; set; }
}