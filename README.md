# CVJob - Cover Letter & Resume Generator

## Project Overview

CVJob is a web application that helps users create professional cover letters and manage their job applications. The application features a user-friendly interface for generating customized cover letters, profile management, and job application tracking.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui (Radix UI)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **State Management**: React Context API & React Query
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod validation
- **Document Generation**: docx, jspdf

## Project Structure

```
cvjob/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helper functions
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── CoverLetter.tsx # Cover letter viewer
│   │   ├── CoverLetterGenerator.tsx # Cover letter generation
│   │   ├── Profile.tsx     # User profile management
│   │   ├── Resume.tsx      # Resume management
│   │   ├── Auth.tsx        # Authentication page
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Signup page
│   │   └── ...             # Other pages
│   ├── services/           # API and service integrations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── integrations/       # Third-party integrations
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── supabase/               # Supabase configuration and functions
├── scripts/                # Build and utility scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Features

- **User Authentication**: Secure login and registration with Supabase
- **Cover Letter Generator**: AI-assisted cover letter creation
- **Profile Management**: User profile creation and management
- **Job Application Tracking**: Track application status and history
- **Document Export**: Export cover letters in various formats
- **Responsive Design**: Mobile-friendly interface

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager

### Local Development

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd cvjob
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary Supabase credentials and API keys

4. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments for complex logic

### Components

- Keep components small and focused
- Use composition over inheritance
- Leverage shadcn-ui components when possible
- Implement proper prop validation

### State Management

- Use React Query for server state
- Use Context API for global application state
- Use local state for component-specific state

## API Integration

The application uses Supabase for backend services:

- **Authentication**: User login, registration, and session management
- **Database**: Storing user profiles, job applications, and cover letters
- **Storage**: Storing document templates and user uploads
- **Functions**: Server-side logic for document generation

## Deployment

This project can be deployed using:

1. **Lovable Platform**: Open [Lovable](https://lovable.dev/projects/984090b0-1bb9-436c-b8ee-2b24c79094eb) and click on Share -> Publish

2. **Manual Deployment**:
   - Netlify
   - Vercel
   - GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

[MIT License](LICENSE)

## Contact

For questions or support, reach out to the project maintainers.
