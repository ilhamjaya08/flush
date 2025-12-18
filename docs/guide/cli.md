# CLI Commands

Flush provides a powerful CLI tool with Laravel-inspired artisan-like commands for rapid development.

## Installation

The CLI is included when you install Flush:

```bash
bun add flush-cli
# or
bunx create-flush my-app
```

## Available Commands

### Project Management

#### `flush new <name>`

Create a new Flush project:

```bash
flush new my-app
flush new my-app --template basic
```

#### `flush serve`

Start the development server:

```bash
flush serve
flush serve --port 8000
flush serve --host 0.0.0.0
```

### Code Generation

#### `flush make controller`

Generate a new controller:

```bash
# Basic controller
flush make controller UserController

# Resource controller with CRUD methods
flush make controller UserController --resource
```

#### `flush make model`

Generate a new model:

```bash
# Basic model
flush make model User

# Model with migration
flush make model User --migration
```

#### `flush make middleware`

Generate middleware:

```bash
flush make middleware AuthMiddleware
```

#### `flush make migration`

Generate database migration:

```bash
flush make migration create_users_table
```

### Database Operations

#### `flush db:migrate`

Run database migrations:

```bash
flush db:migrate
```

#### `flush db:seed`

Seed the database:

```bash
flush db:seed
```

### Development Tools

#### `flush route:list`

List all registered routes:

```bash
flush route:list
```

#### `flush clear`

Clear application cache:

```bash
flush clear
```

## Command Options

### Global Options

- `--help, -h`: Show help information
- `--version, -V`: Show version number
- `--verbose`: Enable verbose output

### Serve Options

- `--port, -p <port>`: Specify port (default: 3000)
- `--host, -h <host>`: Specify host (default: localhost)

### Make Options

- `--resource, -r`: Generate resource controller with CRUD methods
- `--migration, -m`: Also create a migration file

## Examples

### Creating a Complete Feature

```bash
# Create model with migration
flush make model Post --migration

# Create resource controller
flush make controller PostController --resource

# Run migration
flush db:migrate
```

### Development Workflow

```bash
# Start development server
flush serve --port 8000

# In another terminal, generate components
flush make controller ApiController
flush make middleware CorsMiddleware

# List all routes to verify
flush route:list
```

## Custom Commands

You can extend the CLI with custom commands by creating plugins or contributing to the core CLI package.