# Confiado

A debt management application built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)

To install pnpm globally:
```bash
npm install -g pnpm
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Veripact/Confiado.git
   cd Confiado
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server (requires build first)
- `pnpm lint` - Runs ESLint to check for code issues

## Building for Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

The application will be optimized and ready for deployment.

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `styles/` - Global styles

## Development Notes

- The project uses Next.js App Router
- TypeScript and ESLint errors are ignored during builds (configured in `next.config.mjs`)
- Images are unoptimized for easier deployment
- Uses pnpm workspaces and modern React features