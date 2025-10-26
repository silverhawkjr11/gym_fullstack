# Gym Management System - Frontend

An Angular-based frontend for the Gym Management System with Angular Material Design and Catppuccin Mocha color scheme.

## Features

- **Modern UI**: Built with Angular Material Design components
- **Catppuccin Mocha Theme**: Beautiful dark theme with carefully selected colors
- **Responsive Design**: Works seamlessly across different screen sizes
- **Dashboard**: Overview of gym statistics, members, and classes
- **Modular Architecture**: Clean separation of concerns with lazy-loaded routes

## Tech Stack

- **Angular 20.3**: Latest Angular framework
- **Angular Material 20.2**: Material Design components
- **TypeScript 5.9**: Type-safe development
- **SCSS**: Advanced styling capabilities
- **RxJS 7.8**: Reactive programming

## Catppuccin Mocha Color Palette

The application uses the following Catppuccin Mocha colors:

- **Base**: `#1e1e2e` (Background)
- **Mantle**: `#181825` (Sidebar)
- **Surface**: `#313244` (Cards)
- **Text**: `#cdd6f4` (Primary text)
- **Blue**: `#89b4fa` (Primary actions)
- **Mauve**: `#cba6f7` (Accents)
- **Green**: `#a6e3a1` (Success states)
- **Peach**: `#fab387` (Warnings)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── dashboard/          # Dashboard component
│   │   ├── app.ts                  # Main app component
│   │   ├── app.html                # App template with sidebar
│   │   ├── app.scss                # App styles
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Route definitions
│   ├── styles.scss                 # Global styles with Catppuccin theme
│   └── index.html                  # HTML entry point
├── package.json
└── README.md
```

## Installation

1. Ensure you have Node.js (v18 or higher) and npm installed
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

If you encounter issues with dependencies, try:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Development Server

Run the development server:

```bash
npm start
```

Or:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features Implemented

### Dashboard
- Statistics cards showing:
  - Total Members
  - Total Trainers
  - Active Classes
  - Today's Attendance
- Recent members list
- Upcoming classes list

### Navigation
- Sidebar with navigation links:
  - Dashboard
  - Members
  - Trainers
  - Classes
  - Memberships
  - Attendance
- Toolbar with notifications and user account buttons

### Styling
- Custom Catppuccin Mocha theme applied to all Material components
- Smooth transitions and hover effects
- Responsive grid layouts
- Custom scrollbars matching the theme

## Next Steps

To complete the frontend implementation:

1. **Create Service Layer**: Add services to communicate with the Django backend
   - `members.service.ts`
   - `trainers.service.ts`
   - `classes.service.ts`
   - `attendance.service.ts`

2. **Implement CRUD Pages**: Create full CRUD interfaces for:
   - Members management
   - Trainers management
   - Classes scheduling
   - Attendance tracking
   - Membership plans

3. **Add Authentication**: Implement login/logout functionality

4. **Forms**: Create reactive forms for data entry and editing

5. **API Integration**: Connect to the Django REST API backend

6. **State Management**: Consider adding NgRx or Akita for complex state management

7. **Testing**: Add unit tests and e2e tests

## Backend Integration

The frontend is designed to work with the Django REST API backend located in the `../backend` directory.

API Base URL (development): `http://localhost:8000/api/`

## Contributing

When adding new features:

1. Keep the Catppuccin Mocha color scheme consistent
2. Use Angular Material components where possible
3. Follow Angular style guide
4. Ensure responsive design
5. Add appropriate TypeScript types

## License

This project is part of the Gym Management System.
