# 🎨 AI Studio

<div align="center">

![AI Studio Logo](https://img.shields.io/badge/AI-Studio-blue?style=for-the-badge&logo=artstation&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern AI-powered image generation platform with a beautiful, intuitive interface**

*CI Test - Ready for automated testing*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/mohit-sharma-1733/ai-studio/issues) • [✨ Request Feature](https://github.com/mohit-sharma-1733/ai-studio/issues)

![AI Studio Preview](./preview.png)

</div>

## ✨ Features

### 🎯 Core Features
- **🔐 Secure Authentication** - JWT-based user authentication with signup/login
- **📤 Smart Image Upload** - Drag & drop image upload with live preview (max 10MB, JPEG/PNG)
- **🤖 AI Image Generation** - Advanced prompt-based image transformation
- **🎨 Style Selection** - Multiple artistic styles (Realistic, Artistic, Cartoon, Abstract)
- **📊 Generation History** - Browse and restore previous generations
- **🔄 Error Handling** - Intelligent retry logic with "Model overloaded" simulation

### 🎨 User Experience
- **🌙 Dark/Light Theme** - Seamless theme switching with system preference detection
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **⚡ Real-time Updates** - Live generation progress and status updates
- **🎭 Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **♿ Accessibility** - ARIA labels, keyboard navigation, and screen reader support

### 🛠️ Technical Features
- **🔧 TypeScript** - Full type safety across frontend and backend
- **🚀 Modern Stack** - React 18, Vite, Express, SQLite
- **🎨 Tailwind CSS** - Utility-first styling with custom design system
- **📡 RESTful API** - Well-documented OpenAPI specification
- **🧪 Testing Ready** - Jest, Supertest, React Testing Library setup

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

### ⚡ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohit-sharma-1733/ai-studio.git
   cd ai-studio
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   🌐 Backend API will be available at `http://localhost:3001`

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   🎨 Frontend app will be available at `http://localhost:5173`

### 🏗️ Production Build

1. **Build the backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```
   The production build will be in `frontend/dist/`

## 📖 Usage Guide

### 🔐 Getting Started
1. **Sign Up** - Create a new account with email and password
2. **Log In** - Access your existing account
3. **Dashboard** - View your generation statistics and recent activity

### 🎨 Creating AI Images
1. **Upload Image** - Drag & drop or click to select an image (max 10MB)
2. **Write Prompt** - Describe how you want to transform the image
3. **Choose Style** - Select from Realistic, Artistic, Cartoon, or Abstract
4. **Generate** - Click generate and watch the AI work its magic
5. **View Results** - See your generated image with full details

### 📚 Managing History
- Browse all your previous generations
- Click any generation to restore it to the studio
- View generation details and timestamps

### 🌙 Theme Switching
- Click the theme toggle in the sidebar
- Switch between light and dark modes
- Your preference is automatically saved

## 📡 API Reference

The backend provides a RESTful API with the following endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Generations
- `POST /generations` - Create new image generation
- `GET /generations` - Get user's generation history

### 📋 Request/Response Examples

**Create Generation:**
```bash
curl -X POST http://localhost:3001/generations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Transform into cyberpunk style",
    "style": "artistic",
    "imageUpload": "data:image/jpeg;base64,..."
  }'
```

**Response:**
```json
{
  "id": 1,
  "imageUrl": "https://via.placeholder.com/300",
  "prompt": "Transform into cyberpunk style",
  "style": "artistic",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "status": "completed"
}
```

For complete API documentation, see [OPENAPI.yaml](./OPENAPI.yaml).

## API Documentation

See [OPENAPI.yaml](./OPENAPI.yaml) for API specification.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
npm run e2e
```

## 🏗️ Project Architecture

```
ai-studio/
├── 📁 backend/                    # Node.js/Express API Server
│   ├── 📁 src/
│   │   ├── 🗄️ database.ts         # SQLite database setup & queries
│   │   ├── 🚀 index.ts            # Server entry point
│   │   ├── 🛡️ middleware/
│   │   │   └── 🔐 auth.ts         # JWT authentication middleware
│   │   └── 🛣️ routes/
│   │       ├── 🔐 auth.ts         # Authentication endpoints
│   │       └── 🎨 generations.ts  # AI generation endpoints
│   ├── 📦 package.json
│   ├── ⚙️ tsconfig.json
│   └── 🧪 tests/                  # Backend test suite
├── 📁 frontend/                   # React/Vite Client Application
│   ├── 📁 src/
│   │   ├── 🧩 components/         # Reusable UI components
│   │   │   ├── 🔐 Auth.tsx        # Login/Signup forms
│   │   │   ├── 🎨 GenerationStudio.tsx # Main generation interface
│   │   │   ├── 📚 History.tsx     # Generation history viewer
│   │   │   ├── 📤 ImageUpload.tsx # Image upload component
│   │   │   ├── 📊 Dashboard.tsx   # User dashboard
│   │   │   └── 📱 Sidebar.tsx     # Navigation sidebar
│   │   ├── 🌐 context/            # React context providers
│   │   │   ├── 🔐 AuthContext.tsx # Authentication state
│   │   │   └── 🌙 ThemeContext.tsx # Theme management
│   │   ├── 🎣 hooks/              # Custom React hooks
│   │   │   └── 🎨 useGenerations.ts # API data fetching
│   │   ├── 🔧 lib/                # Utility libraries
│   │   │   ├── 🌐 axios.ts        # HTTP client config
│   │   │   └── ⚛️ queryClient.ts  # React Query setup
│   │   ├── 📡 services/           # API service layer
│   │   │   └── 🌐 api.ts          # API client functions
│   │   ├── ⚛️ App.tsx             # Main app component
│   │   ├── 🚀 main.tsx            # App entry point
│   │   └── 🎨 index.css           # Global styles & Tailwind
│   ├── 📦 package.json
│   ├── 🎨 tailwind.config.ts      # Tailwind CSS configuration
│   └── ⚙️ vite.config.ts          # Vite build configuration
├── 📋 EVAL.md                     # Feature implementation checklist
├── 📡 OPENAPI.yaml                # API specification
├── 🤖 AI_USAGE.md                 # AI assistance documentation
└── 📖 README.md                   # Project documentation
```

## 🔧 Tech Stack Details

### Frontend
- **⚛️ React 18** - Modern React with hooks and concurrent features
- **🔷 TypeScript** - Full type safety and better developer experience
- **🎨 Tailwind CSS** - Utility-first CSS framework with dark mode
- **🎭 Framer Motion** - Smooth animations and transitions
- **⚡ Vite** - Fast build tool and development server
- **🔄 TanStack Query** - Powerful data fetching and caching

### Backend
- **🟢 Node.js** - JavaScript runtime for server-side development
- **🚀 Express.js** - Fast, unopinionated web framework
- **🔷 TypeScript** - Type-safe backend development
- **🗄️ SQLite** - Lightweight, file-based database
- **🔐 JWT** - JSON Web Tokens for authentication
- **🧪 Jest** - Testing framework with Supertest

### Development Tools
- **📏 ESLint** - Code linting and style enforcement
- **✨ Prettier** - Code formatting
- **🎯 Husky** - Git hooks for quality checks
- **📦 npm** - Package management

## 🧪 Testing Strategy

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

**Test Coverage:**
- ✅ Authentication endpoints (signup/login)
- ✅ Generation API (success/error cases)
- ✅ Middleware validation
- ✅ Database operations

### Frontend Testing
```bash
cd frontend
npm test                   # Run component tests
npm run test:ui           # Visual testing
```

**Test Coverage:**
- ✅ Component rendering
- ✅ User interactions
- ✅ API integration
- ✅ Error states

## 🚀 Deployment

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env):**
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=./database.db
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 📋 Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   cd backend && npm test && npm run lint
   cd ../frontend && npm test && npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### 🎯 Code Standards

- **TypeScript** - Strict type checking enabled
- **ESLint** - Airbnb config with React rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Structured commit messages

### 🐛 Issue Reporting

Found a bug? Have a feature request? Please:

1. Check existing [issues](https://github.com/yourusername/ai-studio/issues)
2. Create a new issue with detailed description
3. Include screenshots/code snippets if applicable
4. Label appropriately (bug/enhancement/question)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons** - Heroicons for consistent iconography
- **Colors** - Tailwind CSS color palette
- **Inspiration** - Modern AI tools and design systems

## 📞 Support

Need help? Reach out:

- 📧 **Email**: support@aistudio.dev
- 💬 **Discord**: [Join our community](https://discord.gg/aistudio)
- 📖 **Docs**: [Full documentation](https://docs.aistudio.dev)

---

<div align="center">

**Made with ❤️ by the AI Studio team**

⭐ Star us on GitHub • 🐛 Report issues • ✨ Request features

</div>
