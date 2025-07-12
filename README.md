# ArcFusion Take-Home Assignment: Frontend

## How to Run Locally

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-test-main
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup (Development)

#### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
cd app && python main.py
```

#### Frontend Setup
```bash
# Install Node.js dependencies
cd frontend && npm install

# Start React development server
npm start
```

## Project Structure and Component Breakdown

### Frontend Architecture (`/frontend/src/`)

```
src/
├── components/           # Reusable UI components
│   └── ui/              # Base UI components (Button, Input)
├── feature/             # Feature-based modules
│   ├── chat/            # Chat functionality
│   │   └── ChatInterface.tsx
│   ├── upload/          # File upload functionality
│   │   ├── FileUpload.tsx
│   │   └── FilesList.tsx
│   └── session/         # Session management
│       └── SessionManager.tsx
├── layout/              # Layout components
│   ├── AppSideBar.tsx
│   └── MainLayout.tsx
├── hooks/               # Custom React hooks
│   └── useChats.ts
├── services/            # API service layer
│   └── chatService.ts
├── store/               # State management
│   └── sessionStore.ts  # Zustand store
├── types/               # TypeScript type definitions
│   └── api.ts
├── util/                # Utility functions
│   └── dateUtils.ts
└── lib/                 # External library configurations
    └── utils.ts
```

### Key Components

#### 1. **ChatInterface** (`/feature/chat/`)
- Handles message display and user input
- Manages chat history loading
- Real-time message sending with loading states
- Thai timezone formatting for timestamps

#### 2. **FileUpload** (`/feature/upload/`)
- Drag & drop PDF upload functionality
- File validation (PDF only)
- Progress tracking and error handling
- Modal-based UI with file preview

#### 3. **FilesList** (`/feature/upload/`)
- Displays uploaded files with metadata
- File size formatting
- Upload timestamp display
- Modal interface for file management

#### 4. **SessionManager** (`/feature/session/`)
- Memory state tracking

## Tradeoffs and Assumptions Made

### 1. **State Management Choice**
- **Chosen**: Zustand over Redux/Context API
- **Reasoning**: Simpler boilerplate, better TypeScript support, sufficient for app complexity
- **Tradeoff**: Less ecosystem tooling compared to Redux

### 2. **Component Architecture**
- **Chosen**: Feature-based folder structure
- **Reasoning**: Better scalability, clear separation of concerns
- **Tradeoff**: Slightly more complex navigation for smaller projects

## What Would Be Improved in a Real-World Scenario

### 1. **State Management & Caching**
- Implement React Query or SWR for better data fetching
- Add optimistic updates for better UX
- Implement proper cache invalidation strategies

### 2. **Testing Strategy**
- Unit tests for all components (Jest + React Testing Library)
- Integration tests for user flows
- E2E tests with Cypress or Playwright
- Visual regression tests with Chromatic

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **API Client**: Fetch API
- **Backend**: FastAPI, Python
- **Containerization**: Docker, Docker Compose
- **UI Components**: Custom components with Radix UI primitives
