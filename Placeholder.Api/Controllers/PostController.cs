using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Placeholder.Api.DTOs;
using Placeholder.Api.Models;
using Placeholder.Api.Services;

namespace Placeholder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PushNotificationService _pushService;

    public PostController(AppDbContext context, PushNotificationService pushService)
    {
        _context = context;
        _pushService = pushService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _context.Posts
            .OrderByDescending(p => p.PublishedAt)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Slug,
                p.ContentJson,
                p.PublishedAt
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetPostBySlug(string slug)
    {
        var post = await _context.Posts
            .Where(p => p.Slug == slug)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Slug,
                p.ContentJson,
                p.PublishedAt,
                AuthorFollowerCount = p.User.FollowerCount,
                AuthorCategory = p.User.Category,
                AuthorAdSenseClientId = p.User.AdSenseClientId,
                ShowAds = p.User.ShowAds,
                Author = new
                {
                    p.User.FollowerCount,
                    p.User.Category,
                    p.User.AdSenseClientId,
                    p.User.ShowAds
                }
            })
            .FirstOrDefaultAsync();

        if (post == null)
        {
            return NotFound(new { message = "Post not found." });
        }

        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var sanitizer = new Ganss.Xss.HtmlSanitizer();
        var sanitizedContentJson = sanitizer.Sanitize(request.ContentJson);

        var slug = request.Title.ToLowerInvariant().Replace(" ", "-");

        var post = new Post
        {
            UserId = userId,
            Title = request.Title,
            Slug = slug,
            ContentJson = sanitizedContentJson,
            PublishedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var subscriptions = await _context.PushSubscriptions
            .Where(ps => ps.AuthorUserId == userId)
            .ToListAsync();

        var payload = JsonSerializer.Serialize(new
        {
            title = "New Post: " + post.Title,
            url = "/post/" + post.Slug
        });

        foreach (var sub in subscriptions)
        {
            await _pushService.SendNotificationAsync(sub, payload);
        }

        return Ok(post);
    }
}
