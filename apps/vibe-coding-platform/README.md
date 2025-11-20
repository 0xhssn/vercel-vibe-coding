# Vibe Coding Platform

AI-powered coding assistant with cloud sandboxes for running and previewing code.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- E2B API key

### Environment Variables

```bash
# Required
E2B_API_KEY=your_e2b_api_key

# Optional (for production with Trigger.dev)
TRIGGER_SECRET_KEY=your_trigger_secret_key
```

### Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Sandbox Execution

The platform uses **E2B** for cloud sandboxes and **Trigger.dev** for task orchestration.

```
lib/e2b/           # E2B module - Low-level sandbox operations
├── types.ts       # E2B types and timeout constants
├── logger.ts      # Consistent logging
├── client.ts      # E2BClient class (connection pooling)
├── commands.ts    # Command utilities (pnpm, timeouts)
├── files.ts       # File operations
└── index.ts       # Exports

trigger/           # Trigger.dev module - Task orchestration
├── types.ts       # High-level types (SandboxConfig, CommandResult, etc.)
├── sandbox-manager.ts  # SandboxManager class (main API)
├── tasks.ts       # Trigger.dev task definitions
├── client.ts      # Config helpers
└── index.ts       # Exports

lib/trigger-wrapper.ts  # Public API for AI tools
```

### Key Design Decisions

1. **Singleton Pattern**: `E2BClient` and `SandboxManager` use singletons for connection pooling and state management.

2. **Development vs Production**:

   - Dev: Operations run directly via `SandboxManager`
   - Prod: Operations run via Trigger.dev tasks

3. **Automatic pnpm Installation**: The system auto-installs pnpm when needed.

4. **Timeout Configuration**:

   - Dev servers: 5 minutes
   - Install commands: 5 minutes
   - Default commands: 2 minutes
   - Sandbox lifetime: 10 minutes

5. **Health Checks**: Stale sandbox references are detected and reconnected automatically.

### AI Tools

Located in `ai/tools/`:

- `create-sandbox.ts` - Create new sandbox
- `run-command.ts` - Execute commands
- `generate-files.ts` - Generate and upload files
- `get-sandbox-url.ts` - Get preview URLs

## Project Structure

```
app/               # Next.js App Router
├── api/chat/      # AI chat endpoint
├── page.tsx       # Main page

components/        # React components
├── chat/          # Chat UI
├── commands-logs/ # Sandbox output display
├── preview/       # Preview iframe

ai/                # AI configuration
├── tools/         # Tool definitions
├── messages/      # Message types
└── gateway.ts     # Model configuration
```

## Deployment

The app can be deployed to Vercel. For production, configure:

- Trigger.dev project and secret key
- E2B API key in environment variables
