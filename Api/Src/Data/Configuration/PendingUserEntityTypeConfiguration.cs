using Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Data.Configuration;

public class PendingUserEntityTypeConfiguration : IEntityTypeConfiguration<PendingUser>
{
	public void Configure(EntityTypeBuilder<PendingUser> builder)
	{
		builder.HasIndex(u => u.Id);
		builder.Property(u => u.Name)
			.IsRequired()
			.HasMaxLength(15);
		builder.Property(u => u.Email)
			.IsRequired()
			.HasMaxLength(254);
		builder.Property(u => u.Password)
			.IsRequired()
			.HasMaxLength(255);
		builder.Property(u => u.CreatedAt)
			.IsRequired()
			.HasDefaultValueSql("now()");
	}
}