# Dev Launchpad 🚀

A powerful CLI tool for rapidly scaffolding modern development projects with pre-configured libraries and best practices.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Types](#project-types)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development](#development)
- [Configuration](#configuration)
- [Examples](#examples)

## ✨ Features

- **Interactive CLI**: User-friendly command-line interface with guided prompts
- **Multiple Project Types**: Support for Next.js and TypeScript CLI projects
- **Library Integration**: Automatic setup of popular libraries like Prisma and Docker
- **Best Practices**: Pre-configured with modern development standards
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Extensible Architecture**: Easy to add new project types and libraries

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Global Installation

```bash
npm install -g dev-launchpad
```

### Local Development Installation

```bash
# Clone the repository
git clone https://github.com/UsmanKhalil25/dev-launchpad.git
cd dev-launchpad

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link
```

## 📖 Usage

### Basic Usage

```bash
# Create a project with interactive prompts
dev-launchpad

# Create a project with a specific name
dev-launchpad my-awesome-project
```

### Interactive Flow

1. **Project Name**: Enter your project name (or provide it as an argument)
2. **Project Type**: Choose between:
   - Next.js
   - TypeScript CLI
3. **Library Selection** (Next.js only): Select additional libraries:
   - Prisma
   - Prisma + Docker

## 🏗️ Project Types

### Next.js Projects

Creates a modern Next.js application with the following features:

- **TypeScript**: Full TypeScript support
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting and formatting
- **App Router**: Next.js 13+ App Router
- **API Routes**: Built-in API route support
- **Src Directory**: Organized source code structure
- **Turbopack**: Fast bundler for development
- **Import Aliases**: Configured `@/*` import alias

#### Next.js Libraries

##### Prisma

- Database ORM setup with PostgreSQL
- Pre-configured schema with User and Post models
- Database seeder with sample data
- Prisma Client generation
- Migration scripts

##### Prisma + Docker

- Everything from Prisma setup
- Docker Compose configuration for PostgreSQL
- Environment variables for database connection
- Containerized development environment

### TypeScript CLI Projects

Creates a fully configured TypeScript CLI application with:

- **TypeScript**: Strict TypeScript configuration
- **Commander.js**: Command-line argument parsing
- **Build System**: TypeScript compilation setup
- **Development Tools**: ts-node for development
- **Project Structure**: Organized source code layout

## 🏛️ Architecture

### Design Patterns

The project follows several design patterns for maintainability and extensibility:

#### Registry Pattern

- **ProjectHandlerRegistry**: Central registry for all project type handlers
- **Dynamic Handler Registration**: Easy to add new project types
- **Interface-based Design**: All handlers implement `IProjectHandler`

#### Strategy Pattern

- **Library Installers**: Different installation strategies for each library
- **Template System**: Flexible template generation for different project types
- **Prompt System**: Extensible prompt system for user interactions

#### Factory Pattern

- **Template Factories**: Generate different project structures
- **Handler Creation**: Create appropriate handlers based on project type

### Core Components

#### Command Layer (`src/commander/`)

- Handles CLI argument parsing using Commander.js
- Routes commands to appropriate actions
- Provides help and usage information

#### Prompt Layer (`src/inquirer/`)

- Manages interactive user prompts
- Validates user input
- Provides guided project creation flow

#### Handler Layer (`src/project-handlers/`)

- Implements project creation logic
- Manages library installations
- Handles post-setup tasks

#### Template Layer (`src/templates/`)

- Contains project templates
- Provides file generation utilities
- Supports customization and extension

#### Utility Layer (`src/utils/`)

- Common utilities for file operations
- Command execution helpers
- Logging and error handling

### Extension Points

The architecture is designed for easy extension:

1. **New Project Types**: Implement `IProjectHandler` interface
2. **New Libraries**: Implement `ILibraryInstaller` interface
3. **New Templates**: Add templates to the appropriate directory
4. **New Prompts**: Extend the prompt system with new questions

## 📁 Project Structure

```
dev-launchpad/
├── src/
│   ├── commander/           # CLI command handling
│   │   └── actions/         # Command actions
│   ├── enums/              # TypeScript enums
│   ├── inquirer/           # Interactive prompts
│   │   └── prompts/        # Prompt definitions
│   ├── project-handlers/   # Project type handlers
│   │   ├── handlers/       # Specific project handlers
│   │   │   ├── nextjs/     # Next.js project handler
│   │   │   │   └── libraries/ # Library installers
│   │   │   └── typescript-cli/ # TypeScript CLI handler
│   │   ├── interfaces/     # Type definitions
│   │   └── registery.ts    # Handler registry
│   ├── templates/          # Project templates
│   │   ├── docker/         # Docker templates
│   │   ├── prisma/         # Prisma templates
│   │   └── typescript-cli/ # TypeScript CLI templates
│   ├── utils/              # Utility functions
│   └── index.ts            # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development

### Building the Project

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run the compiled application
- `npm run dev`: Build and run the application

### Adding New Project Types

1. Create a new handler in `src/project-handlers/handlers/`
2. Implement the `IProjectHandler` interface
3. Register the handler in `src/project-handlers/registery.ts`
4. Add the project type to the `ProjectType` enum
5. Create corresponding prompts in `src/inquirer/prompts/`

### Adding New Libraries

1. Create a new installer in the appropriate library directory
2. Implement the `ILibraryInstaller` interface
3. Register the installer in the project handler
4. Add the library to the corresponding enum
5. Create templates in `src/templates/`

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- ES2020 target
- NodeNext module resolution
- Strict type checking
- Source maps for debugging

### Package Configuration

- **Type**: ES modules
- **Main**: Compiled JavaScript entry point
- **Bin**: CLI executable configuration

## 📝 Examples

### Creating a Next.js Project with Prisma

```bash
dev-launchpad my-nextjs-app
# Select: Next.js
# Select: Prisma
```

This will create:

- Next.js project with TypeScript and Tailwind
- Prisma ORM with PostgreSQL
- Sample User and Post models
- Database seeder
- Migration scripts

### Creating a TypeScript CLI

```bash
dev-launchpad my-cli-tool
# Select: TypeScript CLI
```

This will create:

- TypeScript CLI project structure
- Commander.js integration
- Build and start scripts
- Development environment setup
