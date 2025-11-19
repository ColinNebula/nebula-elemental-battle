# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Nebula Elemental Battle, please report it by:

1. **DO NOT** open a public issue
2. Email the maintainer directly (if available)
3. Or open a private security advisory on GitHub
4. Include detailed steps to reproduce the vulnerability

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity (critical issues within 1 week)

## Security Measures

### Client-Side Security

- ✅ No sensitive data stored in localStorage
- ✅ XSS protection through React's built-in sanitization
- ✅ Content Security Policy headers enabled
- ✅ HTTPS enforced in production
- ✅ No inline scripts or styles
- ✅ Dependency vulnerability scanning via Dependabot

### Environment Variables

- ✅ `.env` files are git-ignored
- ✅ No hardcoded secrets in source code
- ✅ Environment variable validation
- ✅ Example config provided in `.env.example`

### Build & Deploy

- ✅ Source maps disabled in production
- ✅ Minified and obfuscated production builds
- ✅ Static asset integrity checking
- ✅ Automated dependency updates

## Best Practices for Contributors

1. **Never commit**:
   - `.env` files
   - API keys or tokens
   - Private keys or certificates
   - Personal information

2. **Always**:
   - Review dependencies for vulnerabilities
   - Use environment variables for configuration
   - Validate and sanitize user inputs
   - Keep dependencies up to date

3. **Code Review**:
   - All PRs require review before merge
   - Security-sensitive changes need extra scrutiny
   - Run `npm audit` before submitting PRs

## Security Checklist for Deployment

- [ ] All environment variables properly configured
- [ ] `.env` file not committed to repository
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies up to date (`npm audit`)
- [ ] No console.log statements with sensitive data
- [ ] Error messages don't expose internal details
- [ ] Rate limiting enabled (if using backend)

## Contact

For security concerns, please contact the repository maintainer through GitHub.

**Last Updated**: November 2025
