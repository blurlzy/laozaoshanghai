
namespace LaoShanghai.Infrastructure.Persistence
{
    public static class Startup
    {
        public static void ConfigureCosmos(this IServiceCollection services, string dbEndpoint, string primaryKey, string dbName)
        {
                     
            // ** Each CosmosClient instance is thread-safe and performs efficient connection management and address caching when it operates in Direct mode.
            // To allow efficient connection management and better SDK client performance, we recommend that you use a single instance per AppDomain for the lifetime of the application.
            // Creates a new CosmosClient with the account endpoint URI string and TokenCredential.
            // cosmos client options
            CosmosClientOptions clientOptions = new CosmosClientOptions()
            {
                SerializerOptions = new CosmosSerializationOptions()
                {
                    IgnoreNullValues = true,
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            };

            // register azure cosmos client  
            CosmosClient cosmosClient = new CosmosClient(dbEndpoint, primaryKey, clientOptions);

            var contentContainerId = "content";
            services.AddSingleton<CosmosDbService>(m => new CosmosDbService(cosmosClient, dbName, contentContainerId));
            services.AddSingleton<IContentService, ContentItemService>();

        }
    }
}
