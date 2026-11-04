namespace Placeholder.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int FollowerCount { get; set; } = 0;
    public string? AdSenseClientId { get; set; }
    public bool IsPro { get; set; } = false;
    public bool ShowAds { get; set; } = true;

    // Navigation properties
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<PushSubscription> SubscriptionsAsSubscriber { get; set; } = new List<PushSubscription>();
    public ICollection<PushSubscription> SubscriptionsAsAuthor { get; set; } = new List<PushSubscription>();
}
