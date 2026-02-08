# Contributing to Smart Appointment Booking System

Thank you for your interest in contributing to the Smart Appointment Booking System! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and considerate in all interactions.

---

## How Can I Contribute?

### Reporting Bugs 🐛

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Include details**: OS, browser, steps to reproduce, expected vs actual behavior
4. **Add screenshots** if applicable

### Suggesting Enhancements 💡

1. **Check the roadmap** for planned features
2. **Create a feature request** with clear use cases
3. **Explain the value** it would bring to users
4. **Consider implementation** complexity

### Code Contributions 💻

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding guidelines
4. **Test thoroughly** before submitting
5. **Submit a pull request** with a clear description

---

## Development Setup

### Prerequisites

- Node.js 20+
- .NET SDK 10+
- Angular CLI 21+
- Git
- VS Code (recommended)

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/smart-appointment-booking.git
cd smart-appointment-booking

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
dotnet restore
cd ..

# Run the application
# Terminal 1
cd backend && dotnet run

# Terminal 2
npm start
```

### Environment Setup

1. Copy `.env.example` to `.env` (if provided)
2. Configure database connection
3. Set up API keys (if needed)

---

## Coding Guidelines

### Frontend (Angular/TypeScript)

#### Code Style

- Use **TypeScript strict mode**
- Follow **Angular style guide**: https://angular.dev/style-guide
- Use **standalone components** (no NgModules)
- Prefer **signals** over traditional state management
- Use **new control flow syntax** (@if, @for, @switch)

#### Naming Conventions

```typescript
// Components
export class BookAppointmentComponent { }

// Services
export class AppointmentService { }

// Interfaces
export interface Appointment { }

// Variables (camelCase)
const availableSlots = signal<TimeSlot[]>([]);

// Constants (UPPER_CASE)
const API_BASE_URL = 'http://localhost:5050/api';
```

#### Component Structure

```typescript
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  // 1. Injected dependencies
  private readonly service = inject(AppointmentService);
  
  // 2. Signals
  slots = signal<TimeSlot[]>([]);
  
  // 3. Lifecycle hooks
  ngOnInit() { }
  
  // 4. Public methods
  bookAppointment() { }
  
  // 5. Private methods
  private loadSlots() { }
}
```

### Backend (.NET/C#)

#### Code Style

- Follow **C# conventions**: https://learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/
- Use **async/await** for I/O operations
- Apply **SOLID principles**
- Keep controllers thin, logic in services

#### Naming Conventions

```csharp
// Controllers
public class AppointmentsController : ControllerBase { }

// Models
public class Appointment { }

// Methods (PascalCase)
public async Task<IActionResult> GetAppointments() { }

// Private fields (camelCase with _prefix)
private readonly AppDbContext _context;

// Constants (PascalCase)
private const int MaxSlotsPerDay = 20;
```

#### Controller Structure

```csharp
[ApiController]
[Route("api/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<SlotsController> _logger;

    public SlotsController(AppDbContext context, ILogger<SlotsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimeSlot>>> GetSlots()
    {
        // Implementation
    }
}
```

### Database

- Use **EF Core migrations** for schema changes
- Never commit database files (`.db`, `.sqlite`)
- Include seed data in `OnModelCreating`
- Add indexes for frequently queried columns

---

## Pull Request Process

### Before Submitting

1. ✅ Code compiles without errors
2. ✅ All tests pass: `npm test` and `dotnet test`
3. ✅ No linting errors: `npm run lint`
4. ✅ Updated documentation if needed
5. ✅ Added tests for new features
6. ✅ Rebased on latest `main` branch

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
How to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass

## Screenshots (if applicable)
```

### Review Process

1. **Automatic checks** run (build, tests, linting)
2. **Maintainer review** (usually within 48 hours)
3. **Address feedback** if requested
4. **Approval and merge**

---

## Branch Strategy

### Main Branches

- `main` - Production-ready code
- `staging` - Pre-production testing
- `develop` - Development branch

### Feature Branches

- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation changes

### Workflow

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/my-feature

# Create pull request to develop
```

---

## Commit Messages

Follow **Conventional Commits**: https://www.conventionalcommits.org/

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(booking): add appointment cancellation
fix(slots): resolve timezone issue
docs(readme): update installation instructions
refactor(api): improve error handling
test(appointments): add integration tests
```

---

## Testing

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Backend Tests

```bash
# Run all tests
dotnet test

# Run specific test
dotnet test --filter FullyQualifiedName~AppointmentsControllerTests

# Run with coverage
dotnet test /p:CollectCoverage=true
```

### Writing Tests

#### Frontend (Vitest)

```typescript
describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentService);
  });

  it('should get available slots', async () => {
    const slots = await service.getAvailableSlots();
    expect(slots.length).toBeGreaterThan(0);
  });
});
```

#### Backend (xUnit)

```csharp
public class AppointmentsControllerTests
{
    [Fact]
    public async Task GetAppointments_ReturnsOkResult()
    {
        // Arrange
        var controller = new AppointmentsController(context);

        // Act
        var result = await controller.GetAppointments();

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }
}
```

---

## Documentation

### When to Update Docs

- Adding new features → Update README and API docs
- Changing APIs → Update API_DOCUMENTATION.md
- Architecture changes → Update ARCHITECTURE.md
- Deployment changes → Update AZURE_DEPLOYMENT.md

### Documentation Standards

- Use **Markdown** for all documentation
- Include **code examples** where applicable
- Add **screenshots** for UI changes
- Keep **links** up to date

---

## Code Review Checklist

### For Reviewers

- [ ] Code follows project conventions
- [ ] Tests are comprehensive
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Performance implications considered
- [ ] Error handling is appropriate
- [ ] Code is maintainable and readable

### For Contributors

- [ ] Addressed all review comments
- [ ] Resolved merge conflicts
- [ ] Tests still pass after changes
- [ ] Squashed commits if requested

---

## Getting Help

### Channels

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Email**: [Your Email] (for security issues)

### Resources

- [Angular Documentation](https://angular.dev)
- [.NET Documentation](https://learn.microsoft.com/dotnet/)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Project Wiki](https://github.com/Sid770/smart-appointment-booking/wiki)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

**Thank you for contributing! 🙏**

Your efforts help make this project better for everyone.

---

*For questions about contributing, open an issue or contact the maintainers.*
