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
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/teal-parrot-ecommerce.git
   cd teal-parrot-ecommerce
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_API_BASE_URL=https://backend-project-r734.onrender.com/api/v1
   NEXT_PUBLIC_AUTH_ENABLED=true
   NEXT_PUBLIC_ENABLE_WISHLIST=true
   NEXT_PUBLIC_ENABLE_REVIEWS=true
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

## API Integration

The application integrates with a backend API for:
- User authentication
- Product catalog
- Cart and wishlist management
- Order processing

The API base URL is configured in the `.env.local` file.

## Deployment

This project can be deployed on Vercel or any other Next.js-compatible hosting platform.

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## License

[MIT](LICENSE)
\`\`\`

Let's create a postcss.config.js file:
