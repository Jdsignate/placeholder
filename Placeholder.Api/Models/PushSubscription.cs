namespace Placeholder.Api.Models;

public class PushSubscription
{
    public int Id { get; set; }
    public int SubscriberUserId { get; set; }
    public int AuthorUserId { get; set; }
    public string Endpoint { get; set; } = string.Empty;
    public string P256dh { get; set; } = string.Empty;
    public string Auth { get; set; } = string.Empty;

    // Navigation properties
    public User SubscriberUser { get; set; } = null!;
    public User AuthorUser { get; set; } = null!;
}
