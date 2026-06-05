# Contributing Guidelines

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/Bet-analyse.git
   cd Bet-analyse
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd frontend && npm install
   ```

## Development Workflow

### Code Style
- Use ESLint configuration
- 2-space indentation
- Use `const`/`let` (never `var`)
- Meaningful variable names

### Commit Messages
```
feat(auth): add JWT token refresh
fix(api): handle null response
docs(setup): update installation steps
```

### Testing
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Pull Request Process
1. Update your branch with latest changes
2. Create a pull request with clear description
3. Address code review comments
4. Merge when approved

## Code Quality
- Minimum 80% test coverage
- All new features must have tests
- All bug fixes must have regression tests

## Resources
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Thank you for contributing! 🙌**
