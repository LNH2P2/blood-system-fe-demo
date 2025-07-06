This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

```
boilerplate-nextjs/
├── src/                      # Source files
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── favicon.ico       # Favicon
│   ├── components/           # Reusable components
│   ├── constants/            # Constants and enums
│   ├── lib/                  # Library code, utilities
│   ├── middleware.ts         # Next.js middleware
│   ├── stores/               # State management
│   ├── styles/               # Additional styles
│   ├── templates/            # Page templates
│   └── validations/          # Form validations and schemas
├── public/                   # Static files
├── .husky/                   # Git hooks
├── .vscode/                  # VS Code settings
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── .prettierignore           # Prettier ignore rules
├── components.json           # UI components config
├── commitlint.config.ts      # Commit linting rules
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

This project follows a structured organization to maintain clean code and separation of concerns:

- **src/app**: Contains the Next.js App Router components
- **src/components**: Reusable UI components
- **src/constants**: Application constants and enumerations
- **src/lib**: Utility functions and external libraries integration
- **src/stores**: State management (context, redux, etc.)
- **src/templates**: Page templates for consistent layouts
- **src/validations**: Form validation schemas and rules
