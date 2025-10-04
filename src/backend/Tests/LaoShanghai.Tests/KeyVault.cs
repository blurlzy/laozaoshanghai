using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace LaoShanghai.Tests
{
    public static class KeyVault
    {
        // create an instance of secret client
        // DefaultAzureCredential combines credentials commonly used to authenticate when deployed, with credentials used to authenticate in a development environment.
        // private static SecretClient _secretClient = new SecretClient(new Uri("https://kv-laoshanghai-prod.vault.azure.net"), new DefaultAzureCredential());

        // Define a custom authentication flow with the ChainedTokenCredential       
        // it seems like DefaultAzureCredential fails when using CLI authentication. it needs to use chained crendentials explicitly 
        private static SecretClient _secretClient = new SecretClient(new Uri("https://kv-laoshanghai-prod.vault.azure.net"),
                                                                    new ChainedTokenCredential(new AzureCliCredential()));

        // azure cosmos
        public static readonly string CosmosDbEndpoint;
        public static readonly string CosmosPrimaryKey;
        public static readonly string CosmosDbName;
        // azure storage
        public static readonly string StorageConnectionString;
        // azure contente moderator
        public static readonly string ContentModeratorEndpoint;
        public static readonly string ContentModeratorSubKey;
        
        // twitter api key
        public static readonly string TwitterApiBearerToken;
        // send grid api key
        public static readonly string SendGridApiKey;

        // Static constructor is called at most one time, before any instance constructor is invoked or member is accessed.
        // A static constructor doesn't take access modifiers or have parameters.
        // A class or struct can only have one static constructor.
        static KeyVault()
        {
            CosmosDbEndpoint = _secretClient.GetSecret("cosmosDbEndpoint").Value.Value;
            CosmosPrimaryKey = _secretClient.GetSecret("cosmosDbPrimaryKey").Value.Value;
            CosmosDbName = _secretClient.GetSecret("cosmosDbName").Value.Value;
            StorageConnectionString = _secretClient.GetSecret("storageConnection").Value.Value;
            ContentModeratorSubKey = _secretClient.GetSecret("contentModeratorSubKey").Value.Value;
            ContentModeratorEndpoint = _secretClient.GetSecret("contentModeratorEndpoint").Value.Value;
            
            // external api keys
            TwitterApiBearerToken = _secretClient.GetSecret("twitterApiBearerToken").Value.Value;
            SendGridApiKey = _secretClient.GetSecret("sendGridApiKey").Value.Value;
        }

    }
}
