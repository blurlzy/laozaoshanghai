

namespace LaoShanghai.Infrastructure.Security.Permissions
{
    /// <summary>
    /// retreive claim values 
    /// </summary>
    public static class ClaimHelper
    {
        /// <summary>
        /// return claim value
        /// </summary>
        /// <param name="user"></param>
        /// <param name="claimPropertyName"></param>
        /// <returns></returns>
        public static string GetClaimValue(ClaimsPrincipal user, string claimPropertyName)
        {
            if (user?.Claims == null || !user.Claims.Any())
            {
                return string.Empty;
            }

            if (string.IsNullOrEmpty(claimPropertyName))
            {
                return string.Empty;
            }

            if (!user.HasClaim(c => c.Type == claimPropertyName))
            {
                return string.Empty;
            }

            return user.FindFirst(c => c.Type == claimPropertyName).Value;
        }

        /// <summary>
        /// return a list of claim values
        /// </summary>
        /// <param name="user"></param>
        /// <param name="claimPropertyName"></param>
        /// <returns></returns>
        public static IEnumerable<string> GetClaimArrayValue(ClaimsPrincipal user, string claimPropertyName)
        {
            var result = new List<string>();
            if (user?.Claims == null || !user.Claims.Any())
            {
                return result;
            }

            if (string.IsNullOrEmpty(claimPropertyName))
            {
                return result;
            }

            // get the value
            return user.FindAll(c => c.Type == claimPropertyName).Select(m => m.Value);
        }
    }

    public class Auth0ClaimNames
    {
        private const string NAME_SPACE = "https://laozaoshanghai.com";

        // user email address
        public const string EMAIL = NAME_SPACE + "/email";
    }
}
