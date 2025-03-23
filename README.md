# Livestock Management System for Cassava (LMSC)

A comprehensive web application for managing the cassava supply chain from farm to factory.

![LMSC Dashboard](./public/dashboard-preview.png)

## Overview

LMSC is a Next.js-based platform that connects farmers, processors, and transporters in the cassava supply chain. The system provides specialized dashboards for each stakeholder, allowing them to manage inventory, track shipments, process orders, and generate insights.

## Key Features

- **Role-Based Access**: Custom dashboards for admin, farmers, processors, and transporters
- **Inventory Management**: Track cassava inventory across warehouses
- **Transportation Logistics**: Manage shipment requests and delivery tracking
- **Order Processing**: Create and fulfill cassava product orders
- **Real-Time Analytics**: Visual dashboards with charts and metrics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13 App Router, React, TailwindCSS
- **UI Components**: shadcn/ui component library
- **Database**: SQLite with Drizzle ORM
- **State Management**: React Context and Hooks
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd lmsc
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database
   ```bash
   npm run db:setup
   # or
   yarn db:setup
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

Use these credentials to test the application:

| Role        | Email                 | Password   |
|-------------|----------------------|------------|
| Admin       | admin@cassava.com    | admin123   |
| Farmer      | farmer@cassava.com   | farmer123  |
| Processor   | processor@cassava.com| processor123|
| Transporter | transporter@cassava.com| transporter123|

## Documentation

For detailed documentation on the project setup, architecture, and usage, see [INSTRUCTIONS.txt](./INSTRUCTIONS.txt).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

