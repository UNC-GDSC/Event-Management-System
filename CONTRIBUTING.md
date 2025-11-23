# Contributing to EventHub

Thank you for considering contributing to EventHub! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, etc.)

### Suggesting Features

1. Check existing [Issues](../../issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach (optional)

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Event-Management-System.git
   cd Event-Management-System
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Write clear, concise commit messages
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm run build
   npm run dev
   ```
   - Ensure the app builds without errors
   - Test all affected functionality
   - Check responsive design

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # or
   git commit -m "fix: resolve issue with X"
   ```

   Use conventional commit messages:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting changes
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (if UI changes)
     - Testing done

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add PropTypes or TypeScript interfaces

### Component Structure

```tsx
// Imports
import React from 'react';
import type { Props } from './types';

// Component
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // State and hooks

  // Event handlers

  // Effects

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### File Naming

- Components: PascalCase (e.g., `EventCard.tsx`)
- Utilities: camelCase (e.g., `dateUtils.ts`)
- Types: PascalCase (e.g., `Event`, `User`)

### Firebase Security

- Never commit Firebase credentials
- Use environment variables for configuration
- Test security rules before deployment
- Follow principle of least privilege

### Testing

- Test new features thoroughly
- Include edge cases
- Test on multiple browsers if making UI changes
- Verify mobile responsiveness

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── common/    # Shared components
│   ├── events/    # Event-related components
│   └── ...
├── pages/         # Page components
├── services/      # Firebase service functions
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── config/        # Configuration files
```

## Questions?

Feel free to open an issue for:
- Questions about the codebase
- Help with setup
- Clarification on features
- Discussion about architecture

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's Community Guidelines

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EventHub! 🎉
