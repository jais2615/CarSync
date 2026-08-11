# CarSync

> **One customer, one journey, one unified backbone.**

CarSync is a modern, premium web application designed to bridge the gap between car buyers and automotive dealerships. Built with React and Vite, CarSync delivers an intuitive dual-dashboard experience tailored for both customers searching for Maruti Suzuki vehicles and dealers tracking customer intent and sales approaches.

---

## Features

### Authentication & Role-Based Routing
- **Hero Landing Page**: Sleek dark-mode landing hero with background pattern aesthetics.
- **Dynamic Auth Modal**: Seamless tab switching between **Login** and **Sign Up** with custom input validation.
- **Role Isolation**: Dedicated routing ensuring customers and dealers only access their authorized portals.

### Customer Dashboard
- **INR Budget Filtering**: Filter Maruti Suzuki vehicles by target price range in Indian Rupees (Under ₹10 Lakhs, ₹10L–15L, ₹15L–20L, Above ₹20L).
- **Maruti Suzuki Inventory**: Interactive cards featuring popular models (Alto K10, Swift, Brezza, Baleno, Grand Vitara, XL6, Invicto, Jimny).
- **Interactive Cost Breakdown**: Selecting a vehicle unlocks detailed EMI estimation (down payment, APR, 60-month EMI) and True Cost of Ownership (insurance, fuel, maintenance).
- **Test Drive Scheduling**: Select nearby dealership locations (Delhi, Mumbai, Bengaluru, Hyderabad), choose date & time, and receive instant booking confirmation.
- **Service & Trade-In**: Reminders for annual inspections and trade-in upgrade opportunities.

### Dealer Portal
- **Customer Profiles**: Aggregated view of buyer demographics, preferred vehicles, trade-in details, and budget limits.
- **Purchase Intent Score**: Visual radial progress indicator evaluating lead conversion probability.
- **Suggested Sales Approach**: Recommended strategic tactics tailored to individual buyer contexts.

---

## Tech Stack

- **Core**: React 19, JavaScript (ES6+)
- **Build Tool**: Vite 7
- **Styling**: Vanilla CSS with custom design tokens (Dark mode, Glassmorphism, CSS Variables)
- **Icons**: Lucide React (`lucide-react`)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation

1. **Clone or Extract the repository**:
   ```bash
   cd carsync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

---

## Project Structure

```
carsync/
├── src/
│   ├── assets/             # Static assets and media
│   ├── components/
│   │   ├── AuthScreen.jsx        # Landing page & Login/Sign-up modal
│   │   ├── CustomerDashboard.jsx # Vehicle selection, EMI calculator & Test Drive booking
│   │   └── DealerDashboard.jsx   # Customer intent tracker & sales strategy insights
│   ├── App.jsx             # Main application state & role-based routing
│   ├── index.css           # Global design system, glassmorphism & dark theme styles
│   └── main.jsx            # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
```// filepath: c:\Users\jaspr\Downloads\carsync\README.md
# CarSync

> **One customer, one journey, one unified backbone.**

CarSync is a modern, premium web application designed to bridge the gap between car buyers and automotive dealerships. Built with React and Vite, CarSync delivers an intuitive dual-dashboard experience tailored for both customers searching for Maruti Suzuki vehicles and dealers tracking customer intent and sales approaches.

---

## Features

### Authentication & Role-Based Routing
- **Hero Landing Page**: Sleek dark-mode landing hero with background pattern aesthetics.
- **Dynamic Auth Modal**: Seamless tab switching between **Login** and **Sign Up** with custom input validation.
- **Role Isolation**: Dedicated routing ensuring customers and dealers only access their authorized portals.

### Customer Dashboard
- **INR Budget Filtering**: Filter Maruti Suzuki vehicles by target price range in Indian Rupees (Under ₹10 Lakhs, ₹10L–15L, ₹15L–20L, Above ₹20L).
- **Maruti Suzuki Inventory**: Interactive cards featuring popular models (Alto K10, Swift, Brezza, Baleno, Grand Vitara, XL6, Invicto, Jimny).
- **Interactive Cost Breakdown**: Selecting a vehicle unlocks detailed EMI estimation (down payment, APR, 60-month EMI) and True Cost of Ownership (insurance, fuel, maintenance).
- **Test Drive Scheduling**: Select nearby dealership locations (Delhi, Mumbai, Bengaluru, Hyderabad), choose date & time, and receive instant booking confirmation.
- **Service & Trade-In**: Reminders for annual inspections and trade-in upgrade opportunities.

### Dealer Portal
- **Customer Profiles**: Aggregated view of buyer demographics, preferred vehicles, trade-in details, and budget limits.
- **Purchase Intent Score**: Visual radial progress indicator evaluating lead conversion probability.
- **Suggested Sales Approach**: Recommended strategic tactics tailored to individual buyer contexts.

---

## Tech Stack

- **Core**: React 19, JavaScript (ES6+)
- **Build Tool**: Vite 7
- **Styling**: Vanilla CSS with custom design tokens (Dark mode, Glassmorphism, CSS Variables)
- **Icons**: Lucide React (`lucide-react`)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation

1. **Clone or Extract the repository**:
   ```bash
   cd carsync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

---

## Project Structure

```
carsync/
├── src/
│   ├── assets/             # Static assets and media
│   ├── components/
│   │   ├── AuthScreen.jsx        # Landing page & Login/Sign-up modal
│   │   ├── CustomerDashboard.jsx # Vehicle selection, EMI calculator & Test Drive booking
│   │   └── DealerDashboard.jsx   # Customer intent tracker & sales strategy insights
│   ├── App.jsx             # Main application state & role-based routing
│   ├── index.css           # Global design system, glassmorphism & dark theme styles
│   └── main.jsx            # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

---
