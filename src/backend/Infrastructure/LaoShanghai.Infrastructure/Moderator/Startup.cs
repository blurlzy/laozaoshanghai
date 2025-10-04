
namespace LaoShanghai.Infrastructure.Moderator
{
    public static class Startup
    {
        public static void ConfigureContenteModerator(this IServiceCollection services, string subscriptionKey, string endpoint)
        {
            var client = new ContentModeratorClient(new ApiKeyServiceClientCredentials(subscriptionKey))
            {
                Endpoint = endpoint
            };
            
            // register contente moderator
            services.AddSingleton<IContentModerator, CommentModerator>(m => new CommentModerator(client));
           
        }
    }
}
