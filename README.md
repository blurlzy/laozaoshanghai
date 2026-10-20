# LaozaoShanghai

LaozaoShanghai — a digital archive and storytelling space dedicated to preserving the spirit of old Shanghai through photographs, memories, and local history.

## Live website

[https://laozaoshanghai.com/](https://laozaoshanghai.com/)

## Technology stack

| Area | Current implementation |
| --- | --- |
| Active frontend | Angular 22.2, TypeScript 6, standalone components, and Auth0 |
| Legacy frontend | Angular 19 with Angular Material |
| Backend API | ASP.NET Core on .NET 10, organized into Clean Architecture layers |
| Data and media | Azure Cosmos DB and Azure Blob Storage |
| Authentication | Auth0 with JWT authentication and permission-based API authorization |
| Configuration and monitoring | Azure Key Vault and Application Insights |
| Email notifications | SendGrid; a separate Azure Functions v4 project targets .NET 8 |
| Hosting | Azure Static Web Apps for the active frontend; Azure Container Apps for the API |

## Repository structure

```text
.
|-- .github/
|   `-- workflows/                     # Frontend and API deployment workflows
`-- src/
    |-- spa/
    |   |-- laozaoshanghai-v2/          # Active Angular 22 frontend
    |   `-- laozaoshanghai/             # Legacy Angular 19 frontend
    `-- backend/
        |-- LaoShanghai.sln
        |-- Core/
        |   |-- LaoShanghai.Core/      # Application requests, DTOs, and interfaces
        |   |-- LaoShanghai.Domain/    # Content and comment domain models
        |   `-- LaoShanghai.Shared/    # Shared utilities
        |-- Infrastructure/
        |   `-- LaoShanghai.Infrastructure/
        |                              # Cosmos DB, blob storage, email, and security
        |-- Host/
        |   `-- LaoShanghai.Host/      # API controllers, startup, cache, and Dockerfile
        |-- Azure Functions/
        |   `-- LaoShanghai.Serverless.Functions/
        |                              # Cosmos DB-triggered comment email notifications
        `-- Tests/
            `-- LaoShanghai.Tests/     # xUnit tests, including external-service tests
```

### Frontend

The deployed application is [laozaoshanghai-v2](src/spa/laozaoshanghai-v2). Its application code is divided into:

- [main-module](src/spa/laozaoshanghai-v2/src/app/main-module): public archive pages, content cards, details, and the about page.
- [admin-module](src/spa/laozaoshanghai-v2/src/app/admin-module): administrative screens, content editing, and admin data access.
- [shared](src/spa/laozaoshanghai-v2/src/app/shared): layouts, shared UI components, models, directives, and services.
- [environments](src/spa/laozaoshanghai-v2/src/environments): development and production API/Auth0 settings.

The original [laozaoshanghai](src/spa/laozaoshanghai) application remains in the repository but is not the target of the current frontend deployment workflow.

### Backend

The API separates application logic and domain models from infrastructure integrations:

- **Core** defines content/comment requests, validation, DTOs, and service/repository contracts.
- **Domain** contains the content and comment models.
- **Shared** contains reusable utilities.
- **Infrastructure** implements persistence, file storage, email delivery, authentication, and authorization.
- **Host** composes the services and exposes controllers for content items, comment management, site activities, and version information.

The separate Azure Functions project listens for Cosmos DB changes and sends email notifications for new comments.

## Local development

Run the following commands from the repository root unless otherwise noted. Examples use PowerShell.

### Prerequisites

- Node.js compatible with the checked-in Angular toolchain: `^22.22.3`, `^24.15.0`, or `>=26.0.0`.
- npm (the active frontend declares `npm@11.16.0`).
- .NET 10 SDK for the API and tests.
- An Azure identity with access to the configured Key Vault and the required service configuration.
- For the optional Functions project: .NET 8 SDK and Azure Functions Core Tools v4.

### Run the active frontend

```powershell
Set-Location .\src\spa\laozaoshanghai-v2
npm ci
npm start
```

Open `http://localhost:4200`.

**Important:** the checked-in [development environment](src/spa/laozaoshanghai-v2/src/environments/environment.development.ts) currently points to the deployed API. To use a local backend, change `apiEndpoint` to `https://localhost:7128/`. Configure the Auth0 values for your tenant and allow the local application's callback/logout URLs as needed.

### Run the API

The API loads Azure Key Vault configuration at startup using `DefaultAzureCredential`; it is not configured as an offline-only backend.

1. Set `Azure:KeyVault` in the host configuration, or set the `Azure__KeyVault` environment variable, to your development vault name.
2. Authenticate using a supported credential, such as Azure CLI sign-in (`az login`), and ensure that identity can read the vault's secrets.
3. Populate the secrets expected by [KeyVaultSecretKeys.cs](src/backend/Host/LaoShanghai.Host/KeyVaultSecretKeys.cs), including Auth0, Cosmos DB, Blob Storage, SendGrid, and the bundle license configuration.

**Use development resources:** the checked-in host settings currently reference a production-named vault. Do not run write operations against production resources during local development.

```powershell
dotnet dev-certs https --trust
dotnet run --project .\src\backend\Host\LaoShanghai.Host\LaoShanghai.Host.csproj
```

The default launch profile exposes:

- HTTPS: `https://localhost:7128`
- HTTP: `http://localhost:5128`
- Swagger UI in Development: `https://localhost:7128/swagger`

### Build and test

Frontend commands, from the active frontend directory:

```powershell
npm run build
npm test
```

The frontend build defaults to production. Tests use the Angular unit-test builder with Vitest.

Backend commands, from the repository root:

```powershell
dotnet build .\src\backend\Host\LaoShanghai.Host\LaoShanghai.Host.csproj
dotnet test .\src\backend\Tests\LaoShanghai.Tests\LaoShanghai.Tests.csproj
```

The backend test project includes tests that access Azure services and SendGrid, and some tests perform writes or send email. Review [the test configuration](src/backend/Tests/LaoShanghai.Tests/KeyVault.cs) and [the tests](src/backend/Tests/LaoShanghai.Tests/Tests) before running them; use isolated development resources.

## Deployment

GitHub Actions contains two deployment workflows:

- [Static Web Apps](.github/workflows/static-web-apps.yml): builds `src/spa/laozaoshanghai-v2` and deploys `dist/laozaoshanghai-v2/browser`. It handles pushes to `main`, pull request events targeting `main`, and manual runs.
- [Container Apps API](.github/workflows/aca_laozaoshanghai_api.yml): builds the API container using `src/backend` as the build context and [the host Dockerfile](src/backend/Host/LaoShanghai.Host/Dockerfile), pushes the image to Azure Container Registry, and deploys to Azure Container Apps on pushes to `main` or manual runs.

The workflows require the Azure credentials and Static Web Apps deployment token referenced in their GitHub secrets. The Functions project is separate and is not deployed by either workflow.

## Screenshots

![LaozaoShanghai](https://stlaoshanghaiprod.blob.core.windows.net/photos/laozaoshanghai_1.png)
![LaozaoShanghai](https://stlaoshanghaiprod.blob.core.windows.net/photos/laozaoshanghai_2.png)
