# Changelog

All notable changes to Flush Framework will be documented in this file.

## [0.1.0] - 2025-01-01

### Added
- Initial release of Flush Framework
- Core MVC architecture with FlushApp, Router, Controller, and Model classes
- Built-in middleware system (CORS, logging, rate limiting, authentication)
- Zod-powered request validation with type safety
- Laravel-inspired CLI tool with code generators
- Project scaffolding with `create-flush` package
- TypeScript-first development experience
- Bun runtime optimization for maximum performance
- Comprehensive documentation with examples
- Basic testing utilities

### Features
- **FlushApp**: Main application class with routing and middleware support
- **Router**: Flexible routing system with parameters and groups
- **Controllers**: Base controller class with helper methods
- **Models**: Database abstraction layer with CRUD operations
- **Middleware**: Built-in and custom middleware support
- **Validation**: Zod integration for request validation
- **CLI**: Artisan-like commands for rapid development

### CLI Commands
- `flush new <name>` - Create new project
- `flush serve` - Start development server
- `flush make controller` - Generate controllers
- `flush make model` - Generate models
- `flush make middleware` - Generate middleware
- `flush db:migrate` - Run database migrations
- `flush route:list` - List all routes

### Packages
- `flush-core` - Framework core functionality
- `flush-cli` - Command-line interface
- `create-flush` - Project scaffolding tool

## Upcoming Features

### [0.2.0] - Planned
- Database ORM integration (Prisma/Drizzle)
- WebSocket support
- File upload handling
- Caching system
- Queue system
- Enhanced testing utilities

### [0.3.0] - Planned
- Plugin system
- Advanced middleware features
- Performance monitoring
- Production deployment guides
- Docker templates

## Breaking Changes

None yet - this is the initial release.

## Migration Guide

This is the first release, so no migration is needed.

## Contributing

We welcome contributions! Please see our [Contributing Guide](/contributing) for details on how to get started.

## Support

- [GitHub Issues](https://github.com/flush-framework/flush/issues)
- [Discord Community](https://discord.gg/flush-framework)
- [Documentation](https://flush-framework.dev)