# Contributing to BIT2208 Blog

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Git
- Firebase account (for testing cloud features)

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/bit2208-blog.git
   cd bit2208-blog
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-comments`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `test/` - Test additions or updates (e.g., `test/add-post-tests`)

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality
fix(editor): resolve markdown preview rendering issue
docs(readme): update installation instructions
test(posts): add unit tests for post creation
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run end-to-end tests
npm run test:e2e

# Run all checks (lint + tests)
npm run ci
```

### Writing Tests

- Place unit tests in `__tests__` directories next to the code
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert
- Mock external dependencies (Firebase, etc.)

**Example:**
```typescript
describe('PostService', () => {
  it('should create a new post with valid data', async () => {
    // Arrange
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      authorId: 'user-123'
    };

    // Act
    const result = await createPost(postData);

    // Assert
    expect(result).toHaveProperty('id');
    expect(result.title).toBe('Test Post');
  });
});
```

## 🎨 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type - use proper types or `unknown`
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types
- Avoid inline styles - use Tailwind classes

### File Organization

```
src/
├── components/       # Reusable UI components
│   ├── ComponentName.tsx
│   └── __tests__/
│       └── ComponentName.test.tsx
├── pages/           # Route-level components
├── services/        # Business logic and API calls
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🔍 Code Review Process

### Before Submitting a PR

1. **Run all checks**
   ```bash
   npm run ci
   ```

2. **Update documentation** if needed

3. **Add tests** for new features

4. **Update CHANGELOG.md** (if applicable)

### Pull Request Guidelines

- Fill out the PR template completely
- Link related issues
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure CI passes
- Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test with latest version

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 20.0.0]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context or screenshots
```

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up-to-date
- Add inline comments for complex logic
- Update API documentation for service changes

### Documentation Locations

- `README.md` - Project overview and quick start
- `docs/` - Detailed documentation
- `CONTRIBUTING.md` - This file
- Inline comments - Complex code explanations
- JSDoc - Function and API documentation

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email the maintainers directly
2. Provide detailed description
3. Include steps to reproduce
4. Suggest a fix if possible

### Security Best Practices

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user input
- Follow Firebase security rules best practices
- Keep dependencies updated

## 📝 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 📞 Getting Help

- Open an issue for bugs or features
- Join discussions in existing issues
- Check documentation first
- Be patient and respectful

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page (if applicable)

Thank you for contributing to BIT2208 Blog! 🚀
