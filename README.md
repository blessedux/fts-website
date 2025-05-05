# Fanny Torres Enneagram Website

A modern, responsive web application for Fanny Torres Da Silva's Enneagram teaching platform, built with Next.js and Tailwind CSS.

## 🌟 Features

- **Modern Design**: Clean and professional interface with a gold, white, black, and cream color palette
- **Responsive Layout**: Fully responsive design that works on all devices
- **Course Platform**: Complete course management system for Enneagram learning
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Video Integration**: Support for video lessons and content
- **Book Sales**: Integrated book purchasing system
- **Multi-language Support**: Spanish language interface

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Video Processing**: FFmpeg
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fts-webapp.git
cd fts-webapp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in the required environment variables in `.env.local`

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
fts-webapp/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── dashboard/         # User dashboard pages
│   ├── api/               # API routes
│   └── (routes)/          # Public pages
├── components/            # React components
│   ├── ui/               # UI components
│   ├── admin/            # Admin components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
├── public/              # Static assets
└── styles/              # Global styles
```

## 🔑 Key Features Implementation

### Course Management

- Video upload and processing
- Course content organization
- Progress tracking
- Certificate generation

### User Management

- User registration and authentication
- Profile management
- Course enrollment
- Progress tracking

### Admin Features

- Content management
- User management
- Analytics dashboard
- Video processing

## 🎨 Design System

The website uses a consistent color palette:

- Primary Gold: `#D4AF37`
- Dark Gold: `#BFA030`
- Light Gold: `#F5E6C3`
- Dark Gold Text: `#8B6B2E`

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- Secure authentication
- Protected API routes
- Input validation
- XSS protection
- CSRF protection

## 🚀 Deployment

The website is deployed on Vercel with:

- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variable management
- SSL/TLS encryption

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 👥 Team

- Fanny Torres Da Silva - Enneagram Expert
- [Your Name] - Lead Developer
- [Other Team Members]

## 📞 Support

For support, please contact:

- Email: [support email]
- Phone: [support phone]
- Website: [website URL]
