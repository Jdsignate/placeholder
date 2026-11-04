namespace Placeholder.Api.DTOs;

public class CreatePostRequest
{
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentJson { get; set; } = string.Empty;
}
