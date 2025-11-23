# Contributing to Micro SaaS Starter Kit

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Be respectful and constructive.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Why this would be useful
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a new branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   \`\`\`bash
   npm run lint
   npm run build
   npm test
   \`\`\`

5. **Commit your changes**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`

   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test changes
   - `chore:` Build/tooling changes

6. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

7. **Create a Pull Request**
   - Provide clear description
   - Link related issues
   - Add screenshots if UI changes

## Development Setup

\`\`\`bash
# Clone your fork
git clone https://github.com/your-username/micro-saas-starter-kit.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up database
npm run db:push

# Start development server
npm run dev
\`\`\`

## Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable/function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage

## Documentation

- Update README.md if needed
- Update SETUP.md for setup changes
- Add JSDoc comments for functions
- Update API documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to ask questions by creating an issue or reaching out to the maintainers.

Thank you for contributing! 🎉
