using LaoShanghai.Core.Content.ContentItems;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LaoShanghai.Core
{
    public static class Startup
    {
        public static void ConfigureCoreServices(this IServiceCollection services, string lic)
        {
               // register auto mapper            
               //var bundleLicense = configuration[SecretKeys.BundleLicense];

               services.AddAutoMapper(cfg =>
               {
                    cfg.LicenseKey = lic;
                    cfg.AddMaps(typeof(Startup).Assembly);
               });

               // register auto mapper            
               //services.AddAutoMapper(typeof(Startup));

               // register AddMediatR, both work
               // services.AddMediatR(typeof(Startup));
               services.AddMediatR(Assembly.GetExecutingAssembly());
        }

        //public static void ConfigureCdnReplaceService(this IServiceCollection services, string blobStorageEndpoint, string cdnEndpoint)
        //{
        //    // register cdn url replacer service
        //    services.AddSingleton(provider =>
        //        new CdnUrlReplacerService(blobStorageEndpoint, cdnEndpoint)
        //    );

        //}
    }
}
