using Microsoft.EntityFrameworkCore;

namespace Placeholder.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public DbSet<PushSubscription> PushSubscriptions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure jsonb column type for Post.ContentJson
        modelBuilder.Entity<Post>().Property(p => p.ContentJson).HasColumnType("jsonb");

        // Post - User relationship
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // PushSubscription - User relationships (non-convention foreign keys)
        modelBuilder.Entity<PushSubscription>()
            .HasOne(ps => ps.SubscriberUser)
            .WithMany(u => u.SubscriptionsAsSubscriber)
            .HasForeignKey(ps => ps.SubscriberUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PushSubscription>()
            .HasOne(ps => ps.AuthorUser)
            .WithMany(u => u.SubscriptionsAsAuthor)
            .HasForeignKey(ps => ps.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
