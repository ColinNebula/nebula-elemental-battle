# Contributing to Nebula Elemental Battle

Thank you for your interest in contributing to Nebula Elemental Battle! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

## How to Contribute

### 1. Issues

#### Bug Reports
- Use the bug report template
- Provide detailed reproduction steps
- Include browser/OS information
- Add screenshots if applicable

#### Feature Requests
- Clearly describe the proposed feature
- Explain the use case and benefits
- Consider implementation complexity
- Discuss potential alternatives

### 2. Pull Requests

#### Before You Start
1. Check existing issues and PRs
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Set up your development environment

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nebula-card-game.git
cd nebula-card-game

# Install dependencies
npm install

# Install security dependencies
npm install helmet express-rate-limit dotenv joi express-validator

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

#### Code Standards

**JavaScript/React:**
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Use destructuring when appropriate

**CSS:**
- Use CSS modules or styled-components
- Follow BEM naming convention
- Ensure responsive design
- Use CSS custom properties for theming

**Security:**
- Always validate user inputs
- Use the security manager for command processing
- Follow OWASP guidelines
- Test for XSS and injection vulnerabilities

#### Commit Guidelines
```bash
# Format: type(scope): description
# Examples:
feat(game): add new element abilities
fix(ui): resolve card hover animation
docs(readme): update installation instructions
security(auth): implement rate limiting
test(game): add unit tests for card logic
```

#### Pull Request Process
1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### 3. Testing

#### Running Tests
```bash
# Run all tests
npm test

# Run security audit
npm run test:security

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

#### Test Coverage
- Aim for 80%+ code coverage
- Test critical game logic thoroughly
- Include edge cases and error conditions
- Test security validations

### 4. Documentation

#### Code Documentation
- Use JSDoc comments for functions
- Document complex algorithms
- Explain security considerations
- Include usage examples

#### User Documentation
- Update README.md for new features
- Add to tutorial if needed
- Update API documentation
- Include screenshots for UI changes

## Development Guidelines

### Project Structure
```
src/
├── components/     # React components
├── services/      # API and game logic
├── utils/         # Utility functions
├── styles/        # Global styles
└── assets/        # Images and static files
```

### Security Requirements

**All contributions must:**
- Validate user inputs
- Use the security manager
- Avoid XSS vulnerabilities
- Follow secure coding practices
- Include security tests

### Performance Guidelines
- Optimize for 60fps gameplay
- Use React.memo for expensive components
- Implement proper cleanup in useEffect
- Avoid memory leaks
- Test on mobile devices

### Accessibility
- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Tagged release created

## Getting Help

### Communication Channels
- **Discord**: [Nebula Dev Community](https://discord.gg/nebula3d)
- **GitHub Discussions**: For feature discussions
- **Issues**: For bugs and specific requests

### Mentorship
New contributors can request mentorship:
- Comment on issues asking for guidance
- Join our Discord for real-time help
- Attend community calls (announced in Discord)

## Recognition

Contributors are recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- Annual contributor appreciation posts

### Contributor Levels
- **First-time Contributors**: Welcome package and guidance
- **Regular Contributors**: Access to preview features
- **Core Contributors**: Repository access and decision input
- **Maintainers**: Full repository access and leadership role

## Legal

### Contributor License Agreement
By contributing, you agree that your contributions will be licensed under the MIT License.

### Copyright
- Original contributions become part of the project
- Credit given in commit history and documentation
- Large contributions may be specifically credited

---

**Thank you for making Nebula Elemental Battle better! 🎮**

*Questions? Contact us at dev@nebula3d.com*