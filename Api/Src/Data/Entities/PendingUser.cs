using Api.Data.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Api.Data.Entities;

[EntityTypeConfiguration(typeof(PendingUserEntityTypeConfiguration))]
public class PendingUser
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string Email { get; set; }
	public string Password { get; set; }
	public DateTimeOffset CreatedAt { get; set; }
}