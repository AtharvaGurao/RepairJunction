# Appliance Mender Tracker

A modern web application for managing appliance repair services, built with React, TypeScript, and Supabase.

## Features

- User and Technician authentication
- Service request management
- Real-time updates
- Responsive design
- Modern UI components using shadcn/ui
- Secure backend with Supabase

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - React Router DOM
  - Tailwind CSS
  - shadcn/ui components
  - React Hook Form
  - Zod for validation

- **Backend:**
  - Supabase (Authentication, Database, Storage)
  - PostgreSQL

- **Testing:**
  - Jest
  - React Testing Library

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd appliance-mender-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Page components
├── styles/        # Global styles and Tailwind config
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
