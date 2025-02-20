# Recipe App
A modern, high-performance Recipe App built with React 19, TypeScript, and Vite. The app leverages Redux Toolkit for state management and Axios for API handling. It also includes Jest and React Testing Library for unit and integration testing.


## Tech Stack
Frontend: React 19, TypeScript, React Router
State Management: Redux Toolkit
API Handling: Axios
Utilities: Lodash, UUID, React Infinite Scroll
Testing: Jest, React Testing Library
Build Tool: Vite


## Getting Started

### Prerequisites
Make sure you have the following installed on your system:

- **Node.js** (v22.5.1)
- **npm**

### Installation

1. **Clone the repository**:

   ```bash
    git clone https://github.com/Elizabeth-Oteje/recipe-app.git
    cd recipe-app
  ```

2. **Install dependencies**:

   ```bash
   npm install
    ```


### Running the App

To start the development server, run:
    ```bash
    npm run dev
    ```

This will run Vite’s development server, usually available at http://localhost:5173/.

### Build for Production

To build the app for production:

```bash
npm run build
```

### Running Tests
To run unit and integration tests:

```bash
npm run test
```

### Project Structure

The following folder structure is used to keep the codebase modular and
maintainable:

```
|--- recipe-app/
├── src/
│   ├── api/               # API calls
│   ├── components/        # Reusable UI components
│   ├── interfaces/        # Types & Interfaces
│   ├── pages/             # Page components
│   ├── tests/             # Unit and integration tests
│   ├── redux/             # Redux setup
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   ├── index.css          # Global styles
├── public/                # Static assets
├── github/                # GitHub Actions
├── .eslint.config.js           # ESLint configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation

```

📌 Key Features
✅ Fast Performance: Uses Vite for lightning-fast builds.
✅ State Management: Uses Redux Toolkit with persistence.
✅ Infinite Scrolling: Implements lazy loading with react-infinite-scroll-component.
✅ Testing: Includes Jest and React Testing Library for unit and integration testing.

✨ Contributing
Fork the repository.
Create a new branch: git checkout -b feature-name
Commit your changes: git commit -m "Added new feature"
Push to the branch: git push origin feature-name
Open a Pull Request.


