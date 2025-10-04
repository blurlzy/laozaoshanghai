using Microsoft.OpenApi.Models;

namespace LaoShanghai.Host
{
    public static class Startup
    {
        public static void ConfigureCors(this IServiceCollection services, string corsPolicy)
        {
            // allow cors
            services.AddCors(opt =>
            {
                opt.AddPolicy(name: corsPolicy,
                           builder =>
                           {
                               builder.WithOrigins("http://localhost:4200",
                                                   "https://app-laozaoshanghai-web-prod.azurewebsites.net",
                                                   "https://aca-laozaoshanghai-api.jollyflower-2b3452a1.eastasia.azurecontainerapps.io",
                                                   "http://laozaoshanghai.com",
                                                   "https://laozaoshanghai.com",
                                                   "http://www.laozaoshanghai.com",
                                                   "https://www.laozaoshanghai.com").AllowAnyMethod().AllowAnyHeader();
                           });
            });
        }

        public static void ConfigureCache(this IServiceCollection services)
        {
            // enable in-memory cache
            services.AddMemoryCache();
        }

        public static void ConfigureHostServices(this IServiceCollection services)
        {
            // cache
            services.AddSingleton<CacheService>();
        }
        
        public static void ConfigureApplicationInsights(this IServiceCollection services)
        {
            // enable azure application insights
            // application insights InstrumentationKey is set in appsettings.json
            services.AddApplicationInsightsTelemetry();
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                // c.SwaggerDoc("v1", new OpenApiInfo() { Title = "LaozaoShanghai Api 1.0", Version = "v1.0", Description = "API for LaoShanghai web app.", });

                c.SwaggerDoc("v2", new OpenApiInfo
                {
                    Title = "LaozaoShanghai Api 2.0",
                    Description = "API for Laozaoshanghai web app.",
                    Version = "v2.0",
                    // TermsOfService = new Uri("https://example.com/terms"),
                });

                // add bearer token support
                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                c.AddSecurityDefinition("Bearer", securitySchema);
                var securityRequirement = new OpenApiSecurityRequirement
                {
                    { securitySchema, new[] { "Bearer" } }
                };

                c.AddSecurityRequirement(securityRequirement);
            });
        }
    }
}
