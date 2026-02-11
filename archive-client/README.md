# Archive Client

This is the public-facing frontend for the Archive platform built with Next.js 15, React 19, and TypeScript.

## Features

- Browse categories and subcategories
- View articles and posts
- Search functionality
- Responsive design with dark mode support
- Real-time data from backend API

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Backend API running on `http://localhost:8080` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and set your API URL
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Development

```bash
# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://localhost:8080/api/v1`)
- `NEXT_PUBLIC_KRAKENS_PROJECT_ID`: Krakens analytics project ID — identifies which project in the Krakens dashboard receives this app’s analytics (optional; leave unset to disable)

## Project Structure

```
archive-client/
├── app/                    # Next.js app directory
│   ├── (home)/            # Home page route group
│   └── (archive)/         # Archive pages route group
├── components/            # React components
│   ├── archive/          # Archive-specific components
│   ├── home/             # Home page components
│   ├── shared/           # Shared components (Navbar, Footer)
│   ├── theme/            # Theme provider
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions and API client
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## API Integration

The application fetches data from the backend API:

- **Categories**: `GET /api/v1/categories` (public)
- **Subcategories**: `GET /api/v1/sub-categories` (public)
- **Posts**: Coming soon
- **Comments**: Coming soon

## Technologies

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Type Safety**: TypeScript
