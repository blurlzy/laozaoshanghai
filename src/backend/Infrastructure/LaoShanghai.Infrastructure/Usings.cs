global using System.Security.Claims;

global using Microsoft.AspNetCore.Authorization;
global using Microsoft.Azure.Cosmos;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Azure.CognitiveServices.ContentModerator;
global using Microsoft.Azure.CognitiveServices.ContentModerator.Models;
global using Azure.Storage.Blobs;
global using Azure.Storage.Blobs.Models;

global using SendGrid;

global using LaoShanghai.Core.Interfaces;
global using LaoShanghai.Core.Models;
global using LaoShanghai.Core.Exceptions;
global using LaoShanghai.Domain.Content;

global using LaoShanghai.Infrastructure.FileStorage;
global using LaoShanghai.Infrastructure.Persistence;
global using LaoShanghai.Infrastructure.Security.Permissions;