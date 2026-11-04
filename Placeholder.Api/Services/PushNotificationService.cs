using System.Text.Json;
using WebPush;
using Placeholder.Api.Models;

namespace Placeholder.Api.Services;

public class PushNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PushNotificationService> _logger;

    public PushNotificationService(IConfiguration configuration, ILogger<PushNotificationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendNotificationAsync(Placeholder.Api.Models.PushSubscription subscription, string payload)
    {
        try
        {
            var subject = _configuration["VapidDetails:Subject"];
            var publicKey = _configuration["VapidDetails:PublicKey"];
            var privateKey = _configuration["VapidDetails:PrivateKey"];

            var vapidDetails = new VapidDetails(subject, publicKey, privateKey);
            var webPushSub = new WebPush.PushSubscription(subscription.Endpoint, subscription.P256dh, subscription.Auth);

            var client = new WebPushClient();
            await client.SendNotificationAsync(webPushSub, payload, vapidDetails);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send push notification to subscriber {SubscriberId} at endpoint {Endpoint}", subscription.SubscriberUserId, subscription.Endpoint);
        }
    }
}
