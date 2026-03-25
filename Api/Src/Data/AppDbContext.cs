using Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
	public DbSet<User> Users { get; set; }
	public DbSet<PendingUser> PendingUsers { get; set; }
}