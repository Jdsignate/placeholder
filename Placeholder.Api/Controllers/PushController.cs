using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Placeholder.Api.DTOs;
using Placeholder.Api.Models;

namespace Placeholder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PushController : ControllerBase
{
    private readonly AppDbContext _context;

    public PushController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var subscriberUserId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var subscription = new PushSubscription
        {
            SubscriberUserId = subscriberUserId,
            AuthorUserId = request.AuthorUserId,
            Endpoint = request.Endpoint,
            P256dh = request.P256dh,
            Auth = request.Auth
        };

        _context.PushSubscriptions.Add(subscription);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Subscription saved successfully." });
    }
}
