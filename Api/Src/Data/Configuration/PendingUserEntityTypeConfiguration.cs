using Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
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
		builder.Property(u => u.VerificationCode)
			.IsRequired();
		builder.Property(u => u.VerifyAttemptsLeft)
			.IsRequired();
		builder.Property(u => u.Email)
			.IsRequired()
			.HasMaxLength(254); // the technical length limit of email
		builder.Property(u => u.PasswordHash)
			.IsRequired()
			.HasMaxLength(128);
		builder.Property(u => u.LastModifiedAt)
			.IsRequired();
		builder.Property(u => u.ExpiresAt)
			.IsRequired();
	}
}