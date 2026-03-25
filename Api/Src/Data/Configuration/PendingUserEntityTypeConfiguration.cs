using Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Data.Configuration;

public class PendingUserEntityTypeConfiguration : IEntityTypeConfiguration<PendingUser>
{
	public void Configure(EntityTypeBuilder<PendingUser> builder)
	{
		builder.Property(u => u.Name)
			.IsRequired()
			.HasMaxLength(20);
		builder.HasIndex(u => u.Email)
			.IsUnique();
		builder.Property(u => u.Email)
			.IsRequired()
			.HasMaxLength(254);
		builder.Property(u => u.PasswordHash)
			.IsRequired()
			.HasMaxLength(255);
		builder.Property(u => u.CreatedAt)
			.IsRequired()
			.ValueGeneratedOnAdd()
			.HasDefaultValueSql("CURRENT_TIMESTAMP")
			.Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);
	}
}