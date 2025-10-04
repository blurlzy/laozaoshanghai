using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LaoShanghai.Core
{
    public static class Startup
    {
        public static void ConfigureCoreServices(this IServiceCollection services)
        {
            // register auto mapper            
            services.AddAutoMapper(typeof(Startup));

            // register AddMediatR, both work
            // services.AddMediatR(typeof(Startup));
            services.AddMediatR(Assembly.GetExecutingAssembly());
        }
    }
}
