Recipe App
A modern, high-performance Recipe App built with React 19, TypeScript, and Vite. The app leverages Redux Toolkit for state management and Axiox for API handling.

📦 Tech Stack
Frontend: React 19, TypeScript, React Router
State Management: Redux Toolkit
API Handling: Axios
Utilities: Lodash, UUID, React Infinite Scroll
Build Tool: Vite


🚀 Getting Started
Prerequisites
Make sure you have Node.js (>=16) installed.

Installation
Clone the repository:

sh

git clone https://github.com/Elizabeth-Oteje/recipe-app.git
cd recipe-app
Install dependencies:

sh

npm install
Development
To start the development server:

sh

npm run dev
This will run Vite’s development server, usually available at http://localhost:5173/.

Production Build
To create an optimized production build:

sh

npm run build
To preview the build:

sh

npm run preview
Linting
To check and fix linting issues:

sh

npm run lint
📂 Project Structure
csharp

recipe-app/
├── src/
│   ├── api/               # API calls
│   ├── components/        # Reusable UI components
│   ├── interfaces/        # Types & Interfaces
│   ├── pages/             # Page components
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


📌 Key Features
✅ Fast Performance: Uses Vite for lightning-fast builds.
✅ State Management: Uses Redux Toolkit with persistence.
✅ Infinite Scrolling: Implements lazy loading with react-infinite-scroll-component.

✨ Contributing
Fork the repository.
Create a new branch: git checkout -b feature-name
Commit your changes: git commit -m "Added new feature"
Push to the branch: git push origin feature-name
Open a Pull Request.


