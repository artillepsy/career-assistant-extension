using Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Data.Configuration;

public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
{
	public void Configure(EntityTypeBuilder<User> builder)
	{
		builder.Property(u => u.Name)
			.IsRequired()
			.HasMaxLength(50);
		builder.HasIndex(u => u.Email)
			.IsUnique();
		builder.Property(u => u.Email)
			.IsRequired()
			.HasMaxLength(254);
		builder.Property(u => u.Password)
			.IsRequired()
			.HasMaxLength(255);
	}
}