# How to Make Technical Documentation Simpler with Mermaid Diagrams

## A Complete Guide

Technical documentation is often dense, hard to follow, and quickly outdated. This guide shows you how to use Mermaid diagrams to create documentation that is visual, maintainable, and genuinely helpful.

---

## Table of Contents

1. [The Problem with Traditional Documentation](#the-problem-with-traditional-documentation)
2. [Why Mermaid Solves These Problems](#why-mermaid-solves-these-problems)
3. [Understanding Your Audience](#understanding-your-audience)
4. [Choosing the Right Diagram](#choosing-the-right-diagram)
5. [Documentation Patterns](#documentation-patterns)
6. [Step-by-Step Process](#step-by-step-process)
7. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
8. [Advanced Techniques](#advanced-techniques)

---

## The Problem with Traditional Documentation

### 1. Walls of Text

Traditional documentation often looks like this:

> "The user submits a login request to the frontend application, which then forwards the credentials to the authentication service. The authentication service validates the credentials against the user database. If valid, it generates a JWT token and returns it to the frontend. The frontend stores the token and includes it in subsequent API requests. The API gateway validates the token before forwarding requests to backend services."

**The Problem**: This paragraph requires significant mental effort to visualize. Readers must construct a mental model while reading.

### 2. Outdated Diagrams

Image-based diagrams (created in Visio, Lucidchart, etc.) become outdated because:
- They require opening external tools to edit
- They're stored separately from code
- Changes aren't tracked in version control
- Nobody remembers who has the source file

### 3. Inconsistent Representations

Without standards, each team member creates diagrams differently:
- Different shapes for the same concepts
- Inconsistent arrow directions
- Varying levels of detail
- Clashing color schemes

---

## Why Mermaid Solves These Problems

### 1. Diagrams as Code

Mermaid diagrams are plain text that renders as visual diagrams:

```mermaid
sequenceDiagram
    User->>Frontend: Login Request
    Frontend->>Auth: Validate Credentials
    Auth->>Database: Check User
    Database-->>Auth: User Data
    Auth-->>Frontend: JWT Token
    Frontend-->>User: Login Success
```

**Benefits**:
- Lives alongside your code
- Version controlled with Git
- Reviewable in pull requests
- No external tools needed

### 2. Platform Native

Mermaid renders automatically in:
- GitHub markdown files
- GitLab documentation
- Notion pages
- Most modern documentation platforms

No image exports, no broken links, no missing files.

### 3. Consistent by Design

Mermaid enforces consistent styling:
- Standard shapes for each element type
- Automatic layout and spacing
- Built-in color themes
- Predictable output

---

## Understanding Your Audience

Before creating documentation, understand who will read it:

### New Developers (Onboarding)

**Need**: High-level understanding of how things connect

```mermaid
flowchart LR
    subgraph Client
        Web[Web App]
        Mobile[Mobile]
    end

    API[API Gateway]
    Services[Backend Services]
    DB[(Database)]

    Client --> API --> Services --> DB
```

**Guidelines**:
- Keep it simple (5-10 boxes maximum)
- Show major components only
- Emphasize relationships over details

### Senior Engineers (Architecture)

**Need**: Technical details and edge cases

```mermaid
sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant A as Auth Service
    participant S as User Service
    participant Ca as Cache
    participant D as Database

    C->>G: POST /api/users
    G->>A: Validate JWT

    alt Token Valid
        A-->>G: Claims + Permissions
        G->>S: Create User Request

        S->>Ca: Check rate limit
        Ca-->>S: Limit OK

        S->>D: INSERT user
        D-->>S: User created

        S->>Ca: Invalidate user cache
        S-->>G: 201 Created
        G-->>C: User Response
    else Token Invalid
        A-->>G: 401 Unauthorized
        G-->>C: Auth Error
    end
```

**Guidelines**:
- Include error handling paths
- Show caching and optimization
- Detail the full flow including edge cases

### Product/Business Stakeholders

**Need**: Understanding of user impact and business flow

```mermaid
journey
    title Customer Checkout Experience
    section Browse
        Search products: 4: Customer
        View details: 5: Customer
        Add to cart: 5: Customer
    section Checkout
        Enter shipping: 3: Customer
        Enter payment: 2: Customer
        Confirm order: 4: Customer
    section Fulfillment
        Order confirmation: 5: Customer, System
        Shipping notification: 4: Customer, System
        Delivery: 5: Customer, Carrier
```

**Guidelines**:
- Focus on user experience
- Show emotional journey (satisfaction scores)
- Avoid technical jargon

---

## Choosing the Right Diagram

### Decision Guide

Ask yourself: **What question is this documentation answering?**

| Question | Diagram Type |
|----------|--------------|
| "How does data flow through the system?" | Sequence Diagram |
| "What are the components and how do they connect?" | Flowchart or C4 Diagram |
| "What states can this entity be in?" | State Diagram |
| "What's the data model?" | ER Diagram |
| "How are the classes/types structured?" | Class Diagram |
| "What's the project timeline?" | Gantt Chart |
| "What does the user experience look like?" | User Journey |
| "How should we prioritize features?" | Quadrant Chart |

### Diagram Type Deep Dive

#### Flowcharts: Process and Logic

**Best for**: Decision trees, algorithms, business processes, approval workflows

```mermaid
flowchart TD
    A[Receive Order] --> B{Stock Available?}
    B -->|Yes| C[Reserve Stock]
    B -->|No| D{Backorder OK?}
    D -->|Yes| E[Create Backorder]
    D -->|No| F[Cancel Order]
    C --> G[Process Payment]
    E --> G
    G --> H{Payment Success?}
    H -->|Yes| I[Confirm Order]
    H -->|No| J[Release Stock]
    J --> F
    I --> K[Send Confirmation]
```

**When NOT to use**: Time-based interactions (use sequence diagrams instead)

#### Sequence Diagrams: Interactions Over Time

**Best for**: API documentation, service communication, protocol flows

```mermaid
sequenceDiagram
    autonumber
    participant Browser
    participant CDN
    participant API
    participant Cache
    participant DB

    Browser->>CDN: GET /static/app.js
    CDN-->>Browser: Cached JS Bundle

    Browser->>API: GET /api/products
    API->>Cache: Check cache

    alt Cache Hit
        Cache-->>API: Cached products
    else Cache Miss
        API->>DB: SELECT products
        DB-->>API: Product data
        API->>Cache: SET products (TTL: 5m)
    end

    API-->>Browser: JSON Response
```

**When NOT to use**: Static structure (use flowcharts or class diagrams)

#### State Diagrams: Lifecycle Management

**Best for**: Order status, user account states, workflow stages

```mermaid
stateDiagram-v2
    [*] --> Draft

    Draft --> Submitted: submit
    Draft --> Deleted: delete

    Submitted --> UnderReview: assign_reviewer
    Submitted --> Draft: request_changes

    UnderReview --> Approved: approve
    UnderReview --> Rejected: reject
    UnderReview --> Submitted: reassign

    Approved --> Published: publish
    Approved --> Archived: archive

    Rejected --> Draft: revise
    Rejected --> Deleted: delete

    Published --> Archived: archive
    Archived --> Published: restore

    Deleted --> [*]
    Archived --> [*]
```

**When NOT to use**: Simple linear processes (use flowcharts)

#### ER Diagrams: Data Models

**Best for**: Database documentation, API response structures

```mermaid
erDiagram
    TENANT ||--o{ USER : contains
    TENANT ||--o{ PROJECT : owns
    USER ||--o{ PROJECT : manages
    USER ||--o{ TASK : assigned
    PROJECT ||--o{ TASK : contains
    TASK ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes

    TENANT {
        uuid id PK
        string name
        string plan
        datetime created_at
    }

    USER {
        uuid id PK
        uuid tenant_id FK
        string email UK
        string name
        enum role
    }

    PROJECT {
        uuid id PK
        uuid tenant_id FK
        uuid owner_id FK
        string name
        enum status
    }

    TASK {
        uuid id PK
        uuid project_id FK
        uuid assignee_id FK
        string title
        enum priority
        enum status
    }
```

**When NOT to use**: Showing behavior (use sequence or state diagrams)

#### C4 Diagrams: Architecture at Scale

Use the C4 model to zoom in and out of your architecture:

**Level 1 - Context**: Your system and its environment

```mermaid
C4Context
    title System Context - E-Commerce Platform

    Person(customer, "Customer", "Buys products online")
    Person(admin, "Admin", "Manages products and orders")

    System(ecommerce, "E-Commerce Platform", "Online shopping system")

    System_Ext(payment, "Stripe", "Payment processing")
    System_Ext(shipping, "ShipStation", "Shipping fulfillment")
    System_Ext(email, "SendGrid", "Transactional email")

    Rel(customer, ecommerce, "Browses and purchases")
    Rel(admin, ecommerce, "Manages")
    Rel(ecommerce, payment, "Processes payments")
    Rel(ecommerce, shipping, "Ships orders")
    Rel(ecommerce, email, "Sends notifications")
```

**Level 2 - Container**: Applications and data stores

```mermaid
C4Container
    title Container Diagram - E-Commerce Platform

    Person(customer, "Customer")

    System_Boundary(ecom, "E-Commerce Platform") {
        Container(spa, "Web Application", "React", "Single page application")
        Container(api, "API Application", "Node.js/Express", "REST API")
        Container(worker, "Background Worker", "Node.js", "Async job processing")
        ContainerDb(db, "Database", "PostgreSQL", "Stores all data")
        ContainerDb(cache, "Cache", "Redis", "Session and query cache")
        Container(queue, "Message Queue", "RabbitMQ", "Job queue")
    }

    System_Ext(stripe, "Stripe")

    Rel(customer, spa, "Uses", "HTTPS")
    Rel(spa, api, "Calls", "JSON/HTTPS")
    Rel(api, db, "Reads/Writes", "SQL")
    Rel(api, cache, "Caches", "Redis Protocol")
    Rel(api, queue, "Publishes", "AMQP")
    Rel(worker, queue, "Consumes", "AMQP")
    Rel(worker, db, "Reads/Writes", "SQL")
    Rel(api, stripe, "Charges", "HTTPS")
```

---

## Documentation Patterns

### Pattern 1: The README Architecture Section

```markdown
## Architecture

Our system follows a microservices architecture with an API gateway pattern.

```mermaid
flowchart TB
    subgraph Clients
        Web[Web App]
        Mobile[Mobile App]
    end

    subgraph Infrastructure
        LB[Load Balancer]
        Gateway[API Gateway]
    end

    subgraph Services
        Auth[Auth Service]
        Users[User Service]
        Orders[Order Service]
    end

    subgraph Data
        PG[(PostgreSQL)]
        Redis[(Redis)]
    end

    Clients --> LB --> Gateway
    Gateway --> Auth
    Gateway --> Users
    Gateway --> Orders
    Services --> PG
    Services --> Redis
```

### Key Components

- **API Gateway**: Handles authentication, rate limiting, and request routing
- **Auth Service**: Manages user authentication and JWT tokens
- **User Service**: Handles user profiles and preferences
- **Order Service**: Processes and tracks orders
```

### Pattern 2: API Endpoint Documentation

```markdown
## POST /api/orders

Creates a new order for the authenticated user.

### Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway
    participant OrderService
    participant InventoryService
    participant PaymentService
    participant DB

    Client->>Gateway: POST /api/orders
    Gateway->>Gateway: Validate JWT

    Gateway->>OrderService: Create Order Request
    OrderService->>InventoryService: Check Stock
    InventoryService-->>OrderService: Stock Available

    OrderService->>PaymentService: Process Payment
    PaymentService-->>OrderService: Payment Confirmed

    OrderService->>DB: INSERT order
    OrderService->>InventoryService: Reserve Stock

    OrderService-->>Gateway: Order Created
    Gateway-->>Client: 201 Created
```

### Request Body

\`\`\`json
{
  "items": [
    { "productId": "prod_123", "quantity": 2 }
  ],
  "shippingAddress": { ... }
}
\`\`\`
```

### Pattern 3: Decision Documentation (ADR)

```markdown
# ADR-001: Use Event-Driven Architecture for Order Processing

## Context

We need to process orders reliably while integrating with external services.

## Decision

We will use event-driven architecture with a message queue.

```mermaid
flowchart LR
    subgraph Sync["Synchronous Path"]
        API[Order API]
        Validate[Validate Order]
        Save[Save to DB]
    end

    subgraph Async["Asynchronous Path"]
        Queue[(Message Queue)]
        Inventory[Update Inventory]
        Payment[Process Payment]
        Notify[Send Notifications]
        Shipping[Create Shipment]
    end

    API --> Validate --> Save
    Save --> Queue
    Queue --> Inventory
    Queue --> Payment
    Queue --> Notify
    Queue --> Shipping
```

## Consequences

**Positive:**
- Orders are saved immediately (fast response)
- Failures in one service don't block others
- Easy to add new processors

**Negative:**
- Eventual consistency (order status updates are async)
- More complex debugging
```

---

## Step-by-Step Process

### Step 1: Identify Documentation Goals

Ask:
- Who will read this documentation?
- What questions should it answer?
- What decisions should it enable?

### Step 2: Sketch the Structure

Before writing any Mermaid code:
1. List the main concepts/components
2. Identify relationships between them
3. Determine the primary flow

### Step 3: Choose Your Diagrams

Based on your goals:
- Overview/README → Flowchart + C4 Context
- API Documentation → Sequence Diagram
- Data Documentation → ER Diagram
- Process Documentation → Flowchart + State Diagram

### Step 4: Create Iteratively

Start with the simplest diagram that conveys the concept:

```mermaid
flowchart LR
    A[Input] --> B[Process] --> C[Output]
```

Add detail only where it adds clarity:

```mermaid
flowchart LR
    A[User Input] --> B{Valid?}
    B -->|Yes| C[Process Request]
    B -->|No| D[Return Error]
    C --> E[Return Response]
```

### Step 5: Write Supporting Text

Diagrams should be embedded in explanatory text:

> "The validation flow ensures all requests are properly formatted before processing.
> Invalid requests receive immediate feedback, while valid requests proceed to
> the processing stage."
>
> [DIAGRAM HERE]
>
> "Note that validation happens synchronously at the API gateway level,
> ensuring fast feedback for malformed requests."

### Step 6: Review and Iterate

Check your documentation with fresh eyes:
- [ ] Does the diagram render correctly?
- [ ] Can someone unfamiliar with the system understand it?
- [ ] Is the level of detail appropriate?
- [ ] Does the text add value beyond what's in the diagram?

---

## Common Mistakes to Avoid

### 1. Too Much Detail

**Problem:**
```mermaid
flowchart TB
    A[Input] --> B[Validate Format] --> C[Validate Schema] --> D[Validate Types]
    D --> E[Check Required Fields] --> F[Sanitize Input] --> G[Normalize Values]
    G --> H[Log Request] --> I[Start Timer] --> J[Lookup Config]
    J --> K[Initialize Context] --> L[Actually Process]
```

**Solution:** Abstract implementation details

```mermaid
flowchart LR
    A[Input] --> B[Validate & Sanitize] --> C[Process] --> D[Output]
```

### 2. Ambiguous Arrows

**Problem:** What does this arrow mean?
```
Service A --> Service B
```

**Solution:** Label relationships

```mermaid
flowchart LR
    A[Service A] -->|"sends events to"| B[Service B]
    A -->|"queries"| C[(Database)]
```

### 3. Inconsistent Abstraction Levels

**Problem:** Mixing high-level and low-level concepts

```mermaid
flowchart LR
    AWS[AWS Cloud] --> validateEmailFormat[validateEmailFormat]
```

**Solution:** Keep abstraction levels consistent

```mermaid
flowchart LR
    Cloud[Cloud Infrastructure] --> ValidationService[Validation Service]
```

### 4. Diagrams Without Context

**Problem:** Dropping a diagram with no explanation

**Solution:** Always introduce diagrams with context and follow up with insights

---

## Advanced Techniques

### 1. Layered Documentation

Create multiple diagrams at different zoom levels:

**Level 1: Executive Summary**
```mermaid
flowchart LR
    Users --> System --> ExternalServices[External Services]
```

**Level 2: Technical Overview**
```mermaid
flowchart TB
    subgraph Users
        Web
        Mobile
    end
    subgraph System
        API
        Services
        Database
    end
    subgraph External
        Payment
        Email
    end
```

**Level 3: Detailed Component**
```mermaid
sequenceDiagram
    participant API
    participant Auth
    participant Service
    participant DB
    %% ... detailed interaction
```

### 2. Interactive Documentation

Link diagrams together using documentation anchors:

```markdown
See the [Authentication Flow](#authentication-flow) for details on the auth step.
```

### 3. Living Documentation

Keep diagrams close to the code they document:

```
/services
  /auth
    auth-service.ts
    README.md           # Contains auth service diagrams
  /orders
    order-service.ts
    README.md           # Contains order service diagrams
```

### 4. Diagram Generation

For some diagrams, generate Mermaid from code:
- Database schemas → ER diagrams
- API specs → Sequence diagrams
- State machines → State diagrams

---

## Summary

**Making technical documentation simpler with Mermaid:**

1. **Use diagrams as code** - Keep them in version control with your code
2. **Choose the right diagram type** - Match diagram to the question being answered
3. **Layer your documentation** - Overview → Details → Deep Dives
4. **Keep it simple** - Start minimal, add detail only when needed
5. **Provide context** - Diagrams complement text, they don't replace it
6. **Update regularly** - Text docs near code get updated; image docs don't

The goal isn't to create beautiful diagrams—it's to help people understand complex systems quickly and accurately.

---

*This guide is part of the docs-with-mermaid Claude Code skill.*
