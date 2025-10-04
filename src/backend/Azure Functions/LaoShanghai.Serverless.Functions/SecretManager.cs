using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using System;

namespace LaoShanghai.Serverless.Functions
{
    public static class SecretManager
    {
        // system managed identity needs to be enabled for the function so it can access the azure key vault service
        private static SecretClient _secretClient = new SecretClient(new Uri($"https://{Environment.GetEnvironmentVariable("keyVault")}.vault.azure.net"),
                                                                    new ChainedTokenCredential(new ManagedIdentityCredential()));

        // SendGrid api key
        public static readonly string SendGridApiKey;

        static SecretManager()
        {
            SendGridApiKey = _secretClient.GetSecret("sendGridApiKey").Value.Value; 
        }
        
    }
}
