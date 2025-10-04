
namespace LaoShanghai.Infrastructure.FileStorage
{
    public static class Startup
    {
        public static void ConfigureBlobStorage(this IServiceCollection services, string storageConnection)
        {
            // register azure blob client
            services.AddSingleton(m => new BlobServiceClient(storageConnection));
            // register blob repository
            services.AddSingleton<IBlobRepository, BlobRepository>();
        }
    }
}
