namespace LaoShanghai.Host
{
    public static class KeyVaultSecretKeys
    {
        // azure resources
        // cosmos db
        public static readonly string CosmosEndpoint = "cosmosDbEndpoint";
        public static readonly string CosmosPrimaryKey = "cosmosDbPrimaryKey";
        public static readonly string CosmosDbName = "cosmosDbName";
        // storage
        public static readonly string StorageConnectionString = "storageConnection";

        // cognitive services - content moderator;
        public static readonly string ContentModeratorEndpoint = "contentModeratorEndpoint";
        public static readonly string ContentModeratorSubKey = "contentModeratorSubKey";
        
        // auth0
        public static readonly string Auth0Domain = "auth0Domain";
        public static readonly string Auth0Audience = "auth0Audience";

        // send grid
        public static readonly string SendGridApiKey = "sendGridApiKey";
    }
}
