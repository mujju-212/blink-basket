# 🛒 Blink Basket

> **A modern grocery delivery application built with React**

Blink Basket is a feature-rich e-commerce application for grocery delivery built with React and Bootstrap. It provides a seamless shopping experience with product browsing, cart management, user authentication, order tracking, and a comprehensive admin panel.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Phone-based login with OTP verification
- **Product Browsing** - Browse products by categories with search functionality
- **Shopping Cart** - Add, remove, and manage items with quantity selection
- **Wishlist** - Save favorite products for later purchase
- **Address Management** - Multiple delivery addresses support
- **Order Tracking** - View order history and track current orders
- **Responsive Design** - Optimized for all device sizes

### 👨‍💼 Admin Features
- **Dashboard Analytics** - View sales metrics and order statistics
- **Product Management** - Add, edit, and delete products
- **Category Management** - Organize products into categories
- **Order Management** - View and update order statuses
- **User Management** - Monitor customer accounts and activity
- **Banner Management** - Manage promotional banners

## 🚀 Technology Stack

- **Frontend**: React 18, React Router DOM
- **UI Framework**: React Bootstrap, Bootstrap 5
- **Icons**: React Icons, Font Awesome
- **Storage**: Local Storage for data persistence
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Create React App
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
blink-basket/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── auth/           # Login/authentication
│   │   ├── cart/           # Shopping cart
│   │   ├── product/        # Product display
│   │   └── common/         # Shared components
│   ├── pages/              # Main page components
│   ├── services/           # Data services
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── assets/             # Images, styles, icons
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mujju-212/blink-basket.git
   cd blink-basket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env with your API keys (optional for basic functionality)
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Customer Flow
1. **Browse Products** - Explore categories and view product details
2. **Add to Cart** - Select items and quantities
3. **Login** - Sign in with phone number (OTP simulation)
4. **Checkout** - Enter delivery address and place order
5. **Track Order** - Monitor order status in real-time

### Admin Panel Access
- Navigate to `/admin` to access the admin dashboard
- Manage products, orders, and view analytics
- Add new categories and promotional banners

## 📱 Screenshots

### Customer Interface
| Home Page | Product Catalog | Shopping Cart |
|-----------|----------------|---------------|
| Clean homepage with categories | Product grid with filters | Interactive cart management |

### Admin Dashboard
| Analytics | Product Management | Order Management |
|-----------|-------------------|------------------|
| Sales insights and metrics | Add/edit products | Order status updates |

## 🚀 Available Scripts

In the project directory, you can run:

### Development Commands
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run serve` - Serves the production build locally

### Code Quality Commands
- `npm run lint` - Runs ESLint for code linting
- `npm run lint:fix` - Fixes ESLint errors automatically
- `npm run format` - Formats code with Prettier
- `npm run analyze` - Analyzes the bundle size

## 🔧 Configuration

### Environment Variables

The app uses these optional environment variables:

```env
# SMS API for OTP (optional - uses simulation by default)
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_api_key

# App Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

## 📦 Deployment

### Netlify/Vercel Deployment
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service
3. Set environment variables in your hosting dashboard

### GitHub Pages Deployment
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to package.json:
   ```json
   "homepage": "https://mujju-212.github.io/blink-basket"
   ```
3. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## 🔍 Key Features Explained

### Local Storage Architecture
- All data is stored in browser's local storage
- Simulates real backend behavior
- Perfect for demo and portfolio purposes

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Custom CSS for enhanced UX

### State Management
- React Context for global state
- Custom hooks for data management
- Efficient re-rendering optimization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mujju-212**
- GitHub: [@mujju-212](https://github.com/mujju-212)
- Repository: [blink-basket](https://github.com/mujju-212/blink-basket)

## 🙏 Acknowledgments

- Built with Create React App
- UI components from React Bootstrap
- Icons from React Icons and Font Awesome
- Inspired by modern e-commerce platforms

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Mujju-212](https://github.com/mujju-212)

</div>