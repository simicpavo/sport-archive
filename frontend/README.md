# 🏆 Sport Archive - Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.2.0-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)

**A modern Angular application for sports news aggregation and archive management**

[🚀 Quick Start](#-quick-start) • [📁 Project Structure](#-project-structure) • [🛠️ Development](#-development) • [📚 Documentation](#-documentation)

</div>

---

## 📖 Overview

The Sport Archive frontend is a modern Angular application that provides a comprehensive interface for:

- 📰 **Sports News Aggregation** - View articles from multiple Croatian sports portals
- 🔍 **Advanced Search & Filtering** - Find specific content across all sources
- 📊 **Analytics Dashboard** - Track engagement metrics and article performance
- 🏃‍♂️ **Sports Management** - Manage athletes, clubs, and competitions

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **Angular CLI** 20.2.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sport-archive/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at **http://localhost:4200**

## 📁 Project Structure

```
frontend/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 components/           # Reusable UI components
│   │   ├── 📂 pages/               # Page components
│   │   ├── 📂 services/            # API services and business logic
│   │   ├── 📂 models/              # TypeScript interfaces and types
│   │   ├── 📂 guards/              # Route guards
│   │   └── 📂 shared/              # Shared utilities and pipes
│   ├── 📂 assets/                  # Static assets (images, icons, etc.)
│   ├── 📂 environments/            # Environment configurations
│   └── 📄 styles.scss              # Global styles
├── 📄 angular.json                 # Angular CLI configuration
├── 📄 package.json                 # Dependencies and scripts
└── 📄 tsconfig.json               # TypeScript configuration
```

## 🛠️ Development

### Available Commands

| Command           | Description              | Usage                             |
| ----------------- | ------------------------ | --------------------------------- |
| `npm start`       | Start development server | `http://localhost:4200`           |
| `npm run build`   | Build for production     | Creates `dist/` folder            |
| `npm test`        | Run unit tests           | Uses Karma + Jasmine              |
| `npm run e2e`     | Run end-to-end tests     | Uses your preferred e2e framework |
| `npm run lint`    | Lint TypeScript code     | ESLint + Angular rules            |
| `npm run analyze` | Bundle size analysis     | Webpack Bundle Analyzer           |

### Development Server

```bash
# Standard development server
ng serve

# With specific port
ng serve --port 4201

# With host binding (for network access)
ng serve --host 0.0.0.0

# Production mode simulation
ng serve --configuration production
```

### Code Generation

Angular CLI provides powerful scaffolding tools:

```bash
# Generate components
ng generate component features/news/news-list
ng generate component shared/ui/loading-spinner

# Generate services
ng generate service services/news-api
ng generate service shared/utils/date-helper

# Generate modules
ng generate module features/dashboard --routing
ng generate module shared/ui --module=app

# Generate other schematics
ng generate guard guards/auth
ng generate pipe pipes/truncate
ng generate directive directives/highlight
```

## 🏗️ Building

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration production
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Install e2e framework (choose one)
ng add @angular/pwa              # For PWA testing
ng add @playwright/test          # For Playwright
ng add cypress                   # For Cypress

# Run e2e tests
npm run e2e
```

## 🎨 Styling & Theming

- **CSS Framework**: Angular Material
- **Preprocessor**: SCSS
- **Theme System**: CSS Custom Properties + Angular Material theming

### Available Themes

- 🌞 Light Theme (default)
- 🌙 Dark Theme

## 🔧 Configuration

### Environment Variables

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  features: {
    enableAnalytics: false,
    enablePush: false,
  },
};
```

### Build Configurations

| Environment | API URL                   | Features       | Bundle Size |
| ----------- | ------------------------- | -------------- | ----------- |
| Development | `localhost:3000`          | All enabled    | ~2.5MB      |
| Staging     | `staging-api.example.com` | Analytics only | ~1.8MB      |
| Production  | `api.sportarchive.com`    | Optimized      | ~1.2MB      |

## 📚 Key Features

### 🏠 Dashboard

- Real-time sports news feed
- Engagement metrics visualization
- Quick access to recent articles

### 📰 News Management

- Multi-source article aggregation
- Advanced filtering and search
- Article engagement tracking

### 👥 Sports Entities

- Club information and statistics
- Competition standings and results

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guidelines

- Follow Angular Style Guide
- Use TypeScript strict mode
- Write unit tests for new features
- Document complex components

## 🐛 Troubleshooting

### Common Issues

**Node modules conflicts:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Angular CLI version mismatch:**

```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@20.2.0
```

**Port already in use:**

```bash
ng serve --port 4201
```

## 📞 Support

- 📧 **Email**: [pavsimic@gmail.com](mailto:pavsimic@gmail.com)
- 💬 **Discord**: [Username: mrpavo]
- 🐛 **Issues**: [GitHub Issues](https://github.com/username/sport-archive/issues)

---

<div align="center">

**Built with ❤️ using Angular**

[⬆ Back to top](#-sport-archive---frontend)

</div>
