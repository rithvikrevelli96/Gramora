# Gramora

AI Instagram Content Generator - A React + Vite frontend application for generating Instagram content using AI.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Windows PowerShell Users

If you encounter PowerShell execution policy errors, run this command as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Alternatively, you can use Command Prompt (cmd.exe) instead of PowerShell.

## Project Structure

```
Gramora/
├── Frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx     # Main app component
│   │   └── Api.jsx     # API configuration
│   └── package.json    # Frontend dependencies
└── package.json        # Root package for convenience scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run install-deps` - Install frontend dependencies

## API Configuration

The frontend expects a backend API at `http://localhost:8000`. Update the API URL in `Frontend/src/Api.jsx` or set the `VITE_API_URL` environment variable.

## Development

The app is built with:
- React 18
- Vite 5
- Axios for API calls

## Future Plans

This project is set up to easily add a backend component. Consider creating a Python/FastAPI or Node.js/Express backend to handle the AI content generation.