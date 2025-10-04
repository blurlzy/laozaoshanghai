// common namespace imports.
global using System;
global using System.Collections;
global using System.Linq;
global using System.Text.Json;
global using System.Text.Json.Serialization;

global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Mvc.Filters;
global using Microsoft.Extensions.Caching.Memory;
global using Azure.Identity;
global using Azure.Security.KeyVault.Secrets;
global using Azure.Extensions.AspNetCore.Configuration.Secrets;
global using MediatR;
//global using Newtonsoft.Json;
global using Swashbuckle.AspNetCore.Annotations;

global using LaoShanghai.Host;
global using LaoShanghai.Host.Extensions;
global using LaoShanghai.Host.Filters;
global using LaoShanghai.Host.Cache;
global using LaoShanghai.Core;
global using LaoShanghai.Core.Models;
global using LaoShanghai.Core.Content.ContentItems;
global using LaoShanghai.Core.Content.Comments;
global using LaoShanghai.Core.Content.Activities;
global using LaoShanghai.Core.Emails;
global using LaoShanghai.Core.Exceptions;
global using LaoShanghai.Infrastructure.Security.Auth0;
global using LaoShanghai.Infrastructure.Security.Authorization;
global using LaoShanghai.Infrastructure.Persistence;
global using LaoShanghai.Infrastructure.FileStorage;
global using LaoShanghai.Infrastructure.Security.Permissions;
global using LaoShanghai.Infrastructure.Emails;
global using LaoShanghai.Infrastructure.Moderator;