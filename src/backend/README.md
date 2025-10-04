# Introduction 
Laoshanghai project is built with .NET 8.0. It also Follows Clean Architecture Principles.

# Clean architecture
Applications that follow the Dependency Inversion Principle as well as the Domain-Driven Design (DDD) principles tend to arrive at a similar architecture. 
This architecture has gone by many names over the years. One of the first names was Hexagonal Architecture, followed by Ports-and-Adapters. More recently, it's been cited as the Onion Architecture or Clean Architecture

Clean architecture puts the business logic and application model at the center of the application. 
Instead of having business logic depend on data access or other infrastructure concerns, this dependency is inverted: infrastructure and implementation details depend on the Application Core. 
This functionality is achieved by defining abstractions, or interfaces, in the Application Core, which are then implemented by types defined in the Infrastructure layer.

### Domain & Shared

This will contain all entities, enums, types and logic specific to the domain layer.

### Core (Application)

This layer contains all application logic. It is dependent on the domain layer, but has no dependencies on any other layer or project. This layer defines interfaces that are implemented by outside layers. For example, if the application need to access a notification service, a new interface would be added to application and an implementation would be created within infrastructure.

### Infrastructure

This layer contains classes for accessing external resources such as databases, file systems, external services, smtp, and so on. These classes should be based on interfaces defined within the application layer.

### HOST

This layer is a Web API application based on ASP.NET Core 6. This layer depends on both the Application and Infrastructure layers, however, the dependency on Infrastructure is only to support dependency injection. Therefore only *Startup.cs* should reference Infrastructure. This is the entry point of the application. 

## An example of this style of architectural representation. <br>
<img src="https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/media/image5-7.png" width="680">


## A more detailed view of an ASP.NET Core application's architecture when built following these recommendations. <br>
<img src="https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/media/image5-9.png" width="680">


# Project Structure
Here is how the e5Next is structured.:
1.	General Structure 
    ```
        - Host
        - Core
        - Infrastructure
        - Tests 
    ```
2.	Core 
    ```
        - Domain
        - Shared
        - Application / Core
    ```
3.	Infrastructure
    ```
        - Auth
        - Persistance
        - FileStorage
        - Workflow
        - Search
        - Configuration
        - Mailing
        - Messaging / Events
    ```
4.	Host
    ```
        - Work APIs
    ```

Reference Documents
- [Clean Architecture Principles](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- [MediatR - Simple mediator implementation in .NET (In-process messaging with no dependencies.)](https://github.com/jbogard/MediatR)
- [Mediator pattern (behavioral pattern)](https://en.wikipedia.org/wiki/Mediator_pattern)