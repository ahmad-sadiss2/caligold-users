# Cali Drive - Luxury Transportation Service

A modern, full-stack web application for luxury transportation services built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚗 Luxury vehicle fleet management
- 📅 Advanced booking system with date/time picker
- 💳 Stripe payment integration
- 📱 Responsive design for all devices
- 🗺️ Google Maps integration
- 📧 Email notifications
- 🔐 Secure payment processing

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmad-Al3arja/caligold-user.git
   cd caligold-user
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your actual values
   nano .env.local
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Development/Testing
NEXT_PUBLIC_MOCK_PAYMENTS=false
```

## Project Structure

```
cali drive/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── fleet/             # Vehicle fleet page
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...
├── lib/                  # Utility libraries
├── public/               # Static assets
└── styles/               # Global styles
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Payment**: Stripe
- **Maps**: Google Maps API
- **Package Manager**: pnpm

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@caligolddrive.com or create an issue in this repository.
