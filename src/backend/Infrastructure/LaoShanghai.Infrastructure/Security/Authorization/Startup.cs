
namespace LaoShanghai.Infrastructure.Security.Authorization
{
    public static class Startup
    {
        public static void ConfigurePermissions(this IServiceCollection services)
        {
            // add policy-based authorization handlers 
            services.AddAuthorization(options =>
            {
                options.AddPolicy(PolicyNames.WRITE_CONTENT_POLICY, policy => policy.Requirements.Add(new PermissionRequirement(PermissionNames.WRITE_CONTENT_PERMISSION)));
                options.AddPolicy(PolicyNames.DELETE_CONTENT_POLICY, policy => policy.Requirements.Add(new PermissionRequirement(PermissionNames.DELETE_CONTENT_PERMISSION)));
                options.AddPolicy(PolicyNames.REVIEW_COMMENTS_POLICY, policy => policy.Requirements.Add(new PermissionRequirement(PermissionNames.REVIIEW_COMMENTS_PERMISSION)));
            });

            // add authorization handlers
            // permission required handler
            services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
        }
    }
}
