

namespace LaoShanghai.Infrastructure.Security.Auth0
{
    public class Auth0Options
    {
        public const string Auth0 = "Auth0";

        public Auth0Options(string domain, string audience)
        {
            this.Domain = domain;
            this.Audience = audience;
        } 

        public string Domain { get; set; } = String.Empty;
        public string Audience { get; set; } = String.Empty;
    }
}
