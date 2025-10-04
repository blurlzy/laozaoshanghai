var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// register secret client
// ** There is significant delay comes from ManagedIdentityCredential compared to Azure.Identity 1.4.0.
// ** add timeout seconds as a workaround until Microsoft fixes it in the future release
SecretClient secretClient = new SecretClient(new Uri($"https://{builder.Configuration["Azure:KeyVault"]}.vault.azure.net"),
                                              new DefaultAzureCredential(new DefaultAzureCredentialOptions
                                              {
                                                  ExcludeEnvironmentCredential = true,
                                                  ExcludeVisualStudioCodeCredential = true,
                                                  ExcludeInteractiveBrowserCredential = true,
                                              }));


// it requres Azure.Extensions.AspNetCore.Configuration.Secrets package
builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());

// register services
// auth0 JWT
builder.Services.ConfigureAuth0(builder.Configuration[KeyVaultSecretKeys.Auth0Domain], builder.Configuration[KeyVaultSecretKeys.Auth0Audience]);
// permissions (authorization handlers)
builder.Services.ConfigurePermissions();

// azure  cosmos services
builder.Services.ConfigureCosmos(builder.Configuration[KeyVaultSecretKeys.CosmosEndpoint],
                                 builder.Configuration[KeyVaultSecretKeys.CosmosPrimaryKey],
                                 builder.Configuration[KeyVaultSecretKeys.CosmosDbName]);
// azure blob services
builder.Services.ConfigureBlobStorage(builder.Configuration[KeyVaultSecretKeys.StorageConnectionString]);

// content moderator
builder.Services.ConfigureContenteModerator(builder.Configuration[KeyVaultSecretKeys.ContentModeratorSubKey], 
                                            builder.Configuration[KeyVaultSecretKeys.ContentModeratorEndpoint]);

// core services, auto mapper, mediatR..etc
builder.Services.ConfigureCoreServices();

// email services
builder.Services.ConfigureSendGrid(builder.Configuration[KeyVaultSecretKeys.SendGridApiKey]);

// CORS
builder.Services.ConfigureCors("AllowCors");
// in-memory cache
builder.Services.ConfigureCache();
// Azure Application Insights
builder.Services.ConfigureApplicationInsights();
// services
builder.Services.ConfigureHostServices();
// register swagger & open api doc
builder.Services.ConfigureSwagger();

// asp.net api
builder.Services.AddControllers();

// build the web application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    
    app.UseSwaggerUI(options =>
    {
        // options.SwaggerEndpoint($"/swagger/v1/swagger.json", $"v1");
        options.SwaggerEndpoint($"/swagger/v2/swagger.json", $"v2");
        // remove the schemas from Swagger UI
        options.DefaultModelsExpandDepth(-1);
    });
}

// get the logger instance from the app
// ILogger<Program> logger = app.Services.GetRequiredService<ILogger<Program>>();
// error handling pipeline (middleware)
app.UseGlobalExceptionHandler(app.Logger);

// https redirect
// API projects can reject HTTP requests rather than use UseHttpsRedirection to redirect requests to HTTPS.
//app.UseHttpsRedirection();

// configure cors
app.UseCors("AllowCors");

// configure authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
