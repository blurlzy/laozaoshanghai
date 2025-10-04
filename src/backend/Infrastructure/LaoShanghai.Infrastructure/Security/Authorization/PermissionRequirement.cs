namespace LaoShanghai.Infrastructure.Security.Authorization
{
    public class PermissionRequirement: IAuthorizationRequirement
    {
        public string RequiredPermissions { get; }
        
        public PermissionRequirement(string permissions)
        {
            this.RequiredPermissions = permissions;
        }
    }

    // permission handler
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        // check if the user has the required permissions
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if(context.User.Identity.IsAuthenticated)
            {
                // retreive the permissions from user claims
                var permissions = ClaimHelper.GetClaimArrayValue(context.User, "permissions");

                // ** for now, each requirement only containers one permission
                if (permissions.Contains(requirement.RequiredPermissions))
                {
                    // ** A handler doesn't need to handle failures generally, as other handlers for the same requirement may succeed.
                    // requirements have been met
                    context.Succeed(requirement);
                }

            }

            return Task.CompletedTask;
        }
    }
}
