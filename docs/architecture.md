# System Architecture

## Context

Nextzy Rewards is a mobile-first, single-player reward game. The browser renders the game and sends user intentions; the API owns score generation, caps, reward eligibility, one-time claims, and persistence.

```mermaid
flowchart LR
    User[Player] --> Web[Next.js web\nport 3000]
    Web -->|REST over HTTP\nJSON| API[NestJS + Fastify API\nport 4000]
    API --> Rules[GameService\nbusiness rules]
    Rules --> ORM[Prisma Client]
    ORM --> DB[(PostgreSQL 16)]
    API --> Docs[Swagger UI\n/docs]
```

## Container responsibilities

| Boundary         | Owns                                                                                        | Must not own                                                             |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Next.js frontend | Rendering, local interaction state, animation, navigation, API error presentation           | Choosing earned score, changing totals directly, approving reward claims |
| NestJS API       | Validation, random score selection, score cap, reward rules, transactions, response shaping | Browser presentation state                                               |
| PostgreSQL       | Durable player, play history, and reward history records; uniqueness constraints            | Business decisions outside constraints                                   |

## Runtime component diagram

```mermaid
flowchart TB
    subgraph Browser[Frontend]
      Home[Home page]
      Game[Game page]
      Score[ScoreCard]
      History[History]
      Modal[Modal]
      Client[lib/api.ts]

      Home --> Score
      Home --> History
      Home --> Modal
      Game --> Modal
      Home --> Client
      Game --> Client
    end

    subgraph Service[Backend]
      Controller[GameController]
      GameService[GameService]
      PrismaService[PrismaService]
      Constants[game.constants.ts]

      Controller --> GameService
      GameService --> Constants
      GameService --> PrismaService
    end

    Client -->|GET/POST| Controller
    PrismaService --> Database[(PostgreSQL)]
```

## Primary workflows

### Play a round

```mermaid
sequenceDiagram
    actor P as Player
    participant W as Game page
    participant A as POST /game/play
    participant S as GameService
    participant D as PostgreSQL

    P->>W: Select random score
    W->>A: POST (no score in request)
    A->>S: play()
    S->>D: Read player in transaction
    alt score is below 10,000
      S->>S: Randomly select 300/500/1000/3000
      S->>S: Cap total at 10,000
      S->>D: Insert play history and update player
      S-->>W: earned and new total score
      W-->>P: Animate result and show modal
    else score is already 10,000
      S-->>W: 409 Conflict
      W-->>P: Show error modal
    end
```

The history records the selected `earned` value even when only part of it fits below the cap. For example, a total of 9,800 plus an earned value of 500 produces a total of 10,000 and a history entry of 500.

### Claim a reward

```mermaid
sequenceDiagram
    actor P as Player
    participant W as Home page
    participant A as POST /rewards/:checkpoint/claim
    participant S as GameService
    participant D as PostgreSQL

    P->>W: Claim unlocked reward
    W->>A: Send checkpoint
    A->>S: claim(checkpoint)
    S->>S: Validate configured checkpoint
    S->>D: Read score and existing claim
    alt eligible and unclaimed
      S->>D: Insert reward history
      S-->>W: Reward record
      W->>A: GET /player
      W-->>P: Refresh card/history and show success
    else invalid, locked, or claimed
      S-->>W: 400 or 409
      W-->>P: Show error modal
    end
```

## Data model

```mermaid
erDiagram
    Player ||--o{ PlayHistory : has
    Player ||--o{ RewardHistory : has
    Player {
      int id PK
      int score
      datetime updatedAt
    }
    PlayHistory {
      int id PK
      int score
      datetime createdAt
      int playerId FK
    }
    RewardHistory {
      int id PK
      int checkpoint UK
      string rewardName
      datetime createdAt
      int playerId FK
    }
```

## Current constraints and extension points

- The application uses the fixed player ID `1`; there is no authentication or multi-user isolation.
- Reward checkpoint uniqueness is global, which is correct only while one player exists. Multi-player support requires a compound unique key on `(playerId, checkpoint)`.
- The frontend and backend each define score and reward constants. The API is authoritative. Contract tests or generated shared types should replace duplication if the rules change frequently.
- API calls have no retry, timeout, or request correlation ID. Add these before treating the service as production-critical.
- Reset is intentionally destructive and unauthenticated for tester convenience.
