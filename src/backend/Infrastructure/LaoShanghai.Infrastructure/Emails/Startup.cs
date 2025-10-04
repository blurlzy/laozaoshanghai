using SendGrid.Extensions.DependencyInjection;

namespace LaoShanghai.Infrastructure.Emails
{
    public static class Startup
    {
        public static void ConfigureSendGrid(this IServiceCollection services, string sendGridApiKey)
        {
            services.AddSendGrid(options =>
            {
                options.ApiKey = sendGridApiKey;
            });

            // register email sender service
            services.AddSingleton<IEmailSender, EmailSender>();
        }
    }
}
