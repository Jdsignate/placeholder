namespace Placeholder.Api.DTOs;

public class UpdateUserSettingsRequest
{
    public string? AdSenseClientId { get; set; }
    public bool ShowAds { get; set; } = true;
}
