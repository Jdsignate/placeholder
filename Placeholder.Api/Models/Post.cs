namespace Placeholder.Api.Models;

public class Post
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ContentJson { get; set; } = string.Empty;
    public int LegacyViews { get; set; } = 0;
    public int Impressions { get; set; } = 0;
    public DateTime PublishedAt { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}
