# Mermaid Diagram Examples for Technical Documentation

This file contains practical examples of how to use Mermaid diagrams to document various aspects of software systems.

---

## Example 1: API Request Flow Documentation

**Use Case:** Documenting how an API request flows through your system

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client App
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant API as REST API
    participant Cache as Redis Cache
    participant DB as PostgreSQL

    Client->>Gateway: POST /api/orders
    Gateway->>Auth: Validate JWT Token

    alt Token Valid
        Auth-->>Gateway: Token Valid + User Context
        Gateway->>API: Forward Request + User Context

        API->>Cache: Check product availability

        alt Cache Hit
            Cache-->>API: Product data (cached)
        else Cache Miss
            API->>DB: SELECT products
            DB-->>API: Product data
            API->>Cache: SET product data (TTL: 5min)
        end

        API->>DB: INSERT order
        DB-->>API: Order created
        API-->>Gateway: 201 Created + Order ID
        Gateway-->>Client: 201 Created + Order Response

    else Token Invalid/Expired
        Auth-->>Gateway: 401 Unauthorized
        Gateway-->>Client: 401 Unauthorized
    end
```

**Documentation Text:**
> The order creation flow involves authentication validation, cache lookup for product data, and database writes. The API Gateway handles all external requests and delegates authentication to the Auth Service before forwarding valid requests to the REST API.

---

## Example 2: System Architecture Overview

**Use Case:** High-level architecture documentation for README or onboarding

```mermaid
flowchart TB
    subgraph Clients["Client Applications"]
        Web[Web App<br/>React]
        Mobile[Mobile App<br/>React Native]
        CLI[CLI Tool<br/>Node.js]
    end

    subgraph Gateway["API Layer"]
        LB[Load Balancer<br/>nginx]
        API[API Gateway<br/>Kong]
    end

    subgraph Services["Microservices"]
        direction TB
        UserSvc[User Service<br/>Go]
        OrderSvc[Order Service<br/>Java]
        PaymentSvc[Payment Service<br/>Python]
        NotifSvc[Notification Service<br/>Node.js]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL<br/>Primary DB)]
        Redis[(Redis<br/>Cache)]
        Kafka[Kafka<br/>Events]
        S3[(S3<br/>File Storage)]
    end

    subgraph External["External Services"]
        Stripe[Stripe<br/>Payments]
        SendGrid[SendGrid<br/>Email]
        Twilio[Twilio<br/>SMS]
    end

    Web --> LB
    Mobile --> LB
    CLI --> LB
    LB --> API

    API --> UserSvc
    API --> OrderSvc
    API --> PaymentSvc

    UserSvc --> PG
    UserSvc --> Redis
    OrderSvc --> PG
    OrderSvc --> Kafka
    PaymentSvc --> Stripe
    PaymentSvc --> Kafka

    Kafka --> NotifSvc
    NotifSvc --> SendGrid
    NotifSvc --> Twilio
    NotifSvc --> S3
```

---

## Example 3: Database Schema Documentation

**Use Case:** Documenting database relationships for backend developers

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    organizations {
        uuid id PK
        varchar name
        varchar slug UK
        jsonb settings
        timestamp created_at
    }

    organization_members {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        enum role
        timestamp joined_at
    }

    projects {
        uuid id PK
        uuid organization_id FK
        varchar name
        text description
        enum status
        timestamp created_at
        uuid created_by FK
    }

    tasks {
        uuid id PK
        uuid project_id FK
        varchar title
        text description
        enum priority
        enum status
        uuid assignee_id FK
        timestamp due_date
        timestamp created_at
    }

    comments {
        uuid id PK
        uuid task_id FK
        uuid author_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ organization_members : "belongs to"
    organizations ||--o{ organization_members : "has"
    organizations ||--o{ projects : "contains"
    users ||--o{ projects : "creates"
    projects ||--o{ tasks : "has"
    users ||--o{ tasks : "assigned to"
    tasks ||--o{ comments : "has"
    users ||--o{ comments : "writes"
```

---

## Example 4: State Machine Documentation

**Use Case:** Documenting order lifecycle or workflow states

```mermaid
stateDiagram-v2
    [*] --> Draft: Create Order

    Draft --> Pending: Submit Order
    Draft --> Cancelled: Cancel

    state Pending {
        [*] --> AwaitingPayment
        AwaitingPayment --> PaymentReceived: Payment Success
        AwaitingPayment --> PaymentFailed: Payment Failed
        PaymentFailed --> AwaitingPayment: Retry Payment
    }

    Pending --> Processing: Payment Confirmed
    Pending --> Cancelled: Cancel / Timeout

    state Processing {
        [*] --> Picking
        Picking --> Packing: Items Picked
        Packing --> ReadyToShip: Packed
    }

    Processing --> Shipped: Dispatch

    state Shipped {
        [*] --> InTransit
        InTransit --> OutForDelivery: Arrived at Local Hub
        OutForDelivery --> Delivered: Delivery Confirmed
        InTransit --> DeliveryFailed: Delivery Exception
        OutForDelivery --> DeliveryFailed: Delivery Exception
        DeliveryFailed --> InTransit: Retry Delivery
    }

    Shipped --> Delivered: Complete
    Delivered --> [*]

    Cancelled --> [*]

    note right of Draft: Customer can edit order
    note right of Processing: Warehouse operations
    note right of Shipped: Carrier tracking active
```

---

## Example 5: Authentication Flow

**Use Case:** Documenting OAuth2/OIDC authentication flow

```mermaid
sequenceDiagram
    participant User as User Browser
    participant App as Web Application
    participant Auth as Auth Server
    participant API as Resource API

    User->>App: Click "Login"
    App->>App: Generate state & code_verifier
    App->>Auth: Redirect to /authorize<br/>(client_id, redirect_uri, state, code_challenge)

    Auth->>User: Show Login Page
    User->>Auth: Enter Credentials
    Auth->>Auth: Validate Credentials

    alt Credentials Valid
        Auth->>User: Redirect to redirect_uri<br/>(code, state)
        User->>App: Follow Redirect
        App->>App: Verify state
        App->>Auth: POST /token<br/>(code, code_verifier, client_secret)
        Auth->>Auth: Verify code_verifier
        Auth-->>App: access_token, refresh_token, id_token
        App->>App: Store tokens securely
        App-->>User: Login Success - Show Dashboard

        User->>App: Request Protected Resource
        App->>API: GET /resource<br/>(Authorization: Bearer token)
        API->>API: Validate JWT
        API-->>App: Protected Data
        App-->>User: Display Data

    else Credentials Invalid
        Auth-->>User: Error: Invalid Credentials
    end
```

---

## Example 6: CI/CD Pipeline Documentation

**Use Case:** Documenting deployment pipeline stages

```mermaid
flowchart LR
    subgraph Trigger["Trigger"]
        Push[Git Push]
        PR[Pull Request]
        Manual[Manual]
    end

    subgraph Build["Build Stage"]
        Checkout[Checkout Code]
        Install[Install Dependencies]
        Lint[Run Linters]
        TypeCheck[Type Check]
        Compile[Compile/Build]
    end

    subgraph Test["Test Stage"]
        Unit[Unit Tests]
        Integration[Integration Tests]
        E2E[E2E Tests]
        Coverage[Coverage Report]
    end

    subgraph Security["Security Stage"]
        SAST[SAST Scan]
        Deps[Dependency Audit]
        Secrets[Secret Scanning]
    end

    subgraph Deploy["Deploy Stage"]
        DockerBuild[Build Docker Image]
        Push2Registry[Push to Registry]
        DeployStaging[Deploy Staging]
        SmokeTest[Smoke Tests]
        DeployProd[Deploy Production]
    end

    subgraph Notify["Notifications"]
        Slack[Slack Alert]
        Email[Email Report]
    end

    Push --> Checkout
    PR --> Checkout
    Manual --> Checkout

    Checkout --> Install --> Lint --> TypeCheck --> Compile

    Compile --> Unit
    Compile --> Integration
    Unit --> Coverage
    Integration --> E2E

    Compile --> SAST
    Install --> Deps
    Checkout --> Secrets

    E2E --> DockerBuild
    SAST --> DockerBuild
    Deps --> DockerBuild
    Secrets --> DockerBuild

    DockerBuild --> Push2Registry --> DeployStaging --> SmokeTest

    SmokeTest -->|Pass| DeployProd
    SmokeTest -->|Fail| Slack

    DeployProd --> Slack
    DeployProd --> Email
```

---

## Example 7: Class Diagram for Domain Model

**Use Case:** Documenting domain entities and their relationships

```mermaid
classDiagram
    class User {
        -UUID id
        -String email
        -String passwordHash
        -UserRole role
        -DateTime createdAt
        +authenticate(password: String) bool
        +changePassword(old: String, new: String) void
        +hasPermission(permission: Permission) bool
    }

    class Organization {
        -UUID id
        -String name
        -String slug
        -OrganizationSettings settings
        +addMember(user: User, role: MemberRole) void
        +removeMember(user: User) void
        +updateSettings(settings: OrganizationSettings) void
    }

    class Project {
        -UUID id
        -String name
        -String description
        -ProjectStatus status
        -DateTime createdAt
        +addTask(task: Task) void
        +getActiveTasks() Task[]
        +archive() void
    }

    class Task {
        -UUID id
        -String title
        -String description
        -TaskPriority priority
        -TaskStatus status
        -DateTime dueDate
        +assign(user: User) void
        +updateStatus(status: TaskStatus) void
        +addComment(comment: Comment) void
    }

    class Comment {
        -UUID id
        -String content
        -DateTime createdAt
        +edit(content: String) void
        +delete() void
    }

    class OrganizationMember {
        -MemberRole role
        -DateTime joinedAt
    }

    class UserRole {
        <<enumeration>>
        ADMIN
        USER
        GUEST
    }

    class MemberRole {
        <<enumeration>>
        OWNER
        ADMIN
        MEMBER
        VIEWER
    }

    class TaskStatus {
        <<enumeration>>
        TODO
        IN_PROGRESS
        IN_REVIEW
        DONE
        CANCELLED
    }

    User "1" --> "*" OrganizationMember
    Organization "1" --> "*" OrganizationMember
    Organization "1" --> "*" Project
    User "1" --> "*" Project : creates
    Project "1" --> "*" Task
    User "1" --> "*" Task : assigned
    Task "1" --> "*" Comment
    User "1" --> "*" Comment : authors
```

---

## Example 8: Microservices Communication

**Use Case:** Documenting service-to-service communication patterns

```mermaid
flowchart TB
    subgraph sync["Synchronous Communication"]
        direction LR
        A1[Service A] -->|REST/gRPC| B1[Service B]
        B1 -->|Response| A1
    end

    subgraph async["Asynchronous Communication"]
        direction LR
        A2[Service A] -->|Publish Event| MQ[Message Queue]
        MQ -->|Subscribe| B2[Service B]
        MQ -->|Subscribe| C2[Service C]
    end

    subgraph saga["Saga Pattern"]
        direction LR
        Order[Order Service] -->|1. Create Order| OS[(Order DB)]
        Order -->|2. Reserve Items| Inventory[Inventory Service]
        Inventory -->|3. Reserve Stock| IS[(Inventory DB)]
        Inventory -->|4. Stock Reserved| Order
        Order -->|5. Process Payment| Payment[Payment Service]
        Payment -->|6. Charge| PS[(Payment DB)]

        Payment -->|7a. Success| Order
        Payment -.->|7b. Failure| Order
        Order -.->|8. Compensate| Inventory
    end

    subgraph cqrs["CQRS Pattern"]
        direction TB
        Commands[Commands] --> WriteModel[Write Model]
        WriteModel --> EventStore[(Event Store)]
        EventStore --> Projector[Event Projector]
        Projector --> ReadModel[(Read Model)]
        ReadModel --> Queries[Queries]
    end
```

---

## Example 9: User Journey Documentation

**Use Case:** Documenting user experience for product teams

```mermaid
journey
    title E-Commerce Checkout Journey

    section Discovery
        Visit homepage: 5: Customer
        Browse categories: 4: Customer
        Search for product: 4: Customer
        View product details: 5: Customer
        Read reviews: 4: Customer

    section Selection
        Add to cart: 5: Customer
        View cart: 4: Customer
        Apply coupon code: 3: Customer
        Update quantities: 3: Customer

    section Checkout
        Click checkout: 4: Customer
        Enter shipping info: 3: Customer
        Select shipping method: 3: Customer
        Enter payment info: 2: Customer
        Review order: 4: Customer
        Place order: 5: Customer

    section Post-Purchase
        View confirmation: 5: Customer
        Receive email: 4: Customer, System
        Track order: 4: Customer
        Receive delivery: 5: Customer, Carrier
        Leave review: 3: Customer
```

---

## Example 10: Feature Prioritization Matrix

**Use Case:** Documenting feature priority for planning

```mermaid
quadrantChart
    title Feature Priority Matrix - Q1 Planning
    x-axis Low Complexity --> High Complexity
    y-axis Low Business Value --> High Business Value

    quadrant-1 Do Now
    quadrant-2 Plan Carefully
    quadrant-3 Consider Dropping
    quadrant-4 Quick Wins

    SSO Integration: [0.75, 0.9]
    Mobile App: [0.85, 0.85]
    Dark Mode: [0.15, 0.25]
    Export to PDF: [0.25, 0.45]
    Search Improvements: [0.35, 0.75]
    Email Notifications: [0.30, 0.65]
    API Rate Limiting: [0.45, 0.55]
    Dashboard Widgets: [0.55, 0.60]
    Bulk Import: [0.65, 0.70]
    Audit Logging: [0.40, 0.80]
```

---

## Example 11: Project Timeline

**Use Case:** Documenting project milestones and phases

```mermaid
gantt
    title Product Development Roadmap
    dateFormat YYYY-MM-DD

    section Phase 1: Foundation
        Project Setup & Planning     :done, p1_1, 2024-01-01, 14d
        Core Infrastructure          :done, p1_2, after p1_1, 21d
        Authentication System        :done, p1_3, after p1_2, 14d
        Basic API Endpoints          :active, p1_4, after p1_3, 21d

    section Phase 2: Core Features
        User Management              :p2_1, after p1_4, 14d
        Organization Features        :p2_2, after p2_1, 14d
        Project Management           :p2_3, after p2_2, 21d
        Task System                  :p2_4, after p2_3, 21d

    section Phase 3: Advanced Features
        Real-time Collaboration      :p3_1, after p2_4, 28d
        Reporting & Analytics        :p3_2, after p3_1, 21d
        Integrations                 :p3_3, after p3_2, 21d

    section Milestones
        Alpha Release                :milestone, m1, after p1_4, 0d
        Beta Release                 :milestone, m2, after p2_4, 0d
        Public Launch                :milestone, m3, after p3_3, 0d
```

---

## Example 12: Component Hierarchy

**Use Case:** Documenting React/Vue component structure

```mermaid
flowchart TB
    subgraph App["App.tsx"]
        Router[Router]
    end

    subgraph Layout["Layout Components"]
        MainLayout[MainLayout]
        AuthLayout[AuthLayout]
        Header[Header]
        Sidebar[Sidebar]
        Footer[Footer]
    end

    subgraph Pages["Page Components"]
        Dashboard[Dashboard]
        Projects[Projects]
        Settings[Settings]
        Login[Login]
        Register[Register]
    end

    subgraph Features["Feature Components"]
        ProjectList[ProjectList]
        ProjectCard[ProjectCard]
        TaskBoard[TaskBoard]
        TaskColumn[TaskColumn]
        TaskCard[TaskCard]
    end

    subgraph Shared["Shared Components"]
        Button[Button]
        Input[Input]
        Modal[Modal]
        Avatar[Avatar]
        Badge[Badge]
        Spinner[Spinner]
    end

    Router --> MainLayout
    Router --> AuthLayout

    MainLayout --> Header
    MainLayout --> Sidebar
    MainLayout --> Footer
    MainLayout --> Dashboard
    MainLayout --> Projects
    MainLayout --> Settings

    AuthLayout --> Login
    AuthLayout --> Register

    Dashboard --> ProjectList
    Projects --> ProjectList
    ProjectList --> ProjectCard
    ProjectCard --> Badge
    ProjectCard --> Avatar

    Projects --> TaskBoard
    TaskBoard --> TaskColumn
    TaskColumn --> TaskCard
    TaskCard --> Avatar
    TaskCard --> Badge

    Login --> Input
    Login --> Button
    Register --> Input
    Register --> Button

    Settings --> Input
    Settings --> Button
    Settings --> Modal
```

---

## Example 13: Error Handling Flow

**Use Case:** Documenting error handling strategy

```mermaid
flowchart TB
    Start([Request Received]) --> Validate{Validate Input}

    Validate -->|Invalid| ValidationError[ValidationError<br/>400 Bad Request]
    Validate -->|Valid| Authenticate{Authenticate}

    Authenticate -->|No Token| AuthError[AuthenticationError<br/>401 Unauthorized]
    Authenticate -->|Invalid Token| AuthError
    Authenticate -->|Valid| Authorize{Authorize}

    Authorize -->|Forbidden| ForbiddenError[ForbiddenError<br/>403 Forbidden]
    Authorize -->|Allowed| Process{Process Request}

    Process -->|Not Found| NotFoundError[NotFoundError<br/>404 Not Found]
    Process -->|Conflict| ConflictError[ConflictError<br/>409 Conflict]
    Process -->|Success| Success[Success Response<br/>2xx]
    Process -->|Internal Error| ServerError[ServerError<br/>500 Internal Error]

    ValidationError --> ErrorHandler
    AuthError --> ErrorHandler
    ForbiddenError --> ErrorHandler
    NotFoundError --> ErrorHandler
    ConflictError --> ErrorHandler
    ServerError --> ErrorHandler

    ErrorHandler[Error Handler] --> Log[Log Error]
    Log --> Format[Format Response]
    Format --> Respond([Send Response])

    Success --> Respond

    style ValidationError fill:#ffcccc
    style AuthError fill:#ffcccc
    style ForbiddenError fill:#ffcccc
    style NotFoundError fill:#ffcccc
    style ConflictError fill:#ffcccc
    style ServerError fill:#ff9999
    style Success fill:#ccffcc
```

---

## Example 14: Git Branching Strategy

**Use Case:** Documenting team Git workflow

```mermaid
gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Setup CI/CD"

    branch feature/user-auth
    commit id: "Add login"
    commit id: "Add registration"
    commit id: "Add password reset"

    checkout develop
    branch feature/api
    commit id: "Setup API routes"
    commit id: "Add validation"

    checkout develop
    merge feature/user-auth id: "Merge auth" tag: "auth-complete"

    checkout feature/api
    commit id: "Add error handling"

    checkout develop
    merge feature/api id: "Merge API"

    branch release/1.0
    commit id: "Version bump"
    commit id: "Update docs"

    checkout main
    merge release/1.0 id: "Release 1.0" tag: "v1.0.0"

    checkout develop
    merge release/1.0 id: "Sync release"

    branch hotfix/security
    commit id: "Fix vulnerability"

    checkout main
    merge hotfix/security id: "Hotfix" tag: "v1.0.1"

    checkout develop
    merge hotfix/security id: "Sync hotfix"
```

---

## Example 15: Mindmap for Technical Decisions

**Use Case:** Documenting architecture decision records (ADR)

```mermaid
mindmap
    root((API Design<br/>Decisions))
        Protocol
            REST
                Familiar to team
                Good tooling
                Stateless
            GraphQL
                Flexible queries
                Single endpoint
                Learning curve
            gRPC
                High performance
                Strong typing
                Limited browser support
            **Decision: REST**
        Authentication
            JWT
                Stateless
                Self-contained
                Can be large
            Session
                Server state
                Easy revocation
                Scaling issues
            OAuth2
                Standard
                Third-party auth
                Complex setup
            **Decision: JWT + OAuth2**
        Database
            PostgreSQL
                ACID compliant
                JSON support
                Mature
            MongoDB
                Flexible schema
                Horizontal scale
                Eventual consistency
            **Decision: PostgreSQL**
        Caching
            Redis
                Fast
                Data structures
                Pub/Sub
            Memcached
                Simple
                Multi-threaded
                Limited features
            **Decision: Redis**
```

---

*These examples demonstrate how Mermaid diagrams can enhance technical documentation across different use cases. Mix and match these patterns to create comprehensive documentation for your projects.*
