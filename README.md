# Teal Parrot E-commerce

A modern e-commerce platform for silver jewelry, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design for all device sizes
- Product catalog with filtering and search
- User authentication and account management
- Shopping cart and wishlist functionality
- Checkout process
- Order history
- Animated UI components with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Montserrat, Antic Didone)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher

### Local Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/teal-parrot-ecommerce.git
   cd teal-parrot-ecommerce
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`
   This will automatically create a `.env.local` file from `.env.example` if it doesn't exist.

3. Start the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_API_BASE_URL`: URL for the backend API
- `NEXT_PUBLIC_AUTH_ENABLED`: Enable/disable authentication features
- `NEXT_PUBLIC_ENABLE_WISHLIST`: Enable/disable wishlist functionality
- `NEXT_PUBLIC_ENABLE_REVIEWS`: Enable/disable product reviews

Copy `.env.example` to `.env.local` and adjust the values as needed.

## Project Structure

\`\`\`
teal-parrot-ecommerce/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── account/          # Account-related components
│   ├── animated/         # Animation components
│   ├── auth/             # Authentication components
│   ├── checkout/         # Checkout components
│   ├── contact/          # Contact form components
│   ├── guide/            # Size and care guide components
│   ├── landing/          # Landing page components
│   └── ui/               # UI components (shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
├── public/               # Static assets
│   ├── logos/            # Logo files
│   └── ...               # Other images
└── ...                   # Config files
\`\`\`

## Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and use the correct build settings
3. Set the environment variables in the Vercel dashboard

### Manual Deployment

To build the project for production:

\`\`\`bash
pnpm build
\`\`\`

To start the production server:

\`\`\`bash
pnpm start
\`\`\`

## Troubleshooting

### Common Issues

1. **Missing ESLint**: If you encounter ESLint errors during build, install it with:
   \`\`\`bash
   pnpm add -D eslint
   \`\`\`

2. **Image Optimization**: If images don't appear correctly in development, try:
   \`\`\`bash
   pnpm dev --no-image-optimization
   \`\`\`

3. **Type Errors**: The project is configured to ignore TypeScript errors during build. To fix them properly, run:
   \`\`\`bash
   pnpm tsc
   \`\`\`

## License

[MIT](LICENSE)
