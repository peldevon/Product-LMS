"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { salesData } from "@/lib/chart-data"

// Sample sales data
const salesTransactions = [
  {
    id: 1,
    date: "2023-11-01",
    orderId: "ORD-1001",
    quantity: 500,
    quality: "Grade A",
    processor: "Processor A",
    amount: 2500,
    status: "Paid",
  },
  {
    id: 2,
    date: "2023-10-25",
    orderId: "ORD-1002",
    quantity: 750,
    quality: "Grade B",
    processor: "Processor B",
    amount: 3375,
    status: "Paid",
  },
  {
    id: 3,
    date: "2023-10-18",
    orderId: "ORD-1003",
    quantity: 300,
    quality: "Grade A",
    processor: "Processor A",
    amount: 1500,
    status: "Pending",
  },
  {
    id: 4,
    date: "2023-10-10",
    orderId: "ORD-1004",
    quantity: 900,
    quality: "Grade A",
    processor: "Processor C",
    amount: 4500,
    status: "Paid",
  },
  {
    id: 5,
    date: "2023-10-05",
    orderId: "ORD-1005",
    quantity: 450,
    quality: "Grade C",
    processor: "Processor B",
    amount: 1800,
    status: "Paid",
  },
]

// Monthly sales by processor
const salesByProcessor = [
  { month: "Jul", "Processor A": 4500, "Processor B": 3200, "Processor C": 2100 },
  { month: "Aug", "Processor A": 5200, "Processor B": 3800, "Processor C": 2800 },
  { month: "Sep", "Processor A": 4800, "Processor B": 4100, "Processor C": 3200 },
  { month: "Oct", "Processor A": 6200, "Processor B": 5175, "Processor C": 4500 },
  { month: "Nov", "Processor A": 4000, "Processor B": 0, "Processor C": 0 },
]

export default function FarmerSalesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales Management</h1>
      <p className="text-muted-foreground">Track and manage your cassava sales and revenue</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,580</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,750 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Price/kg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.87</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,500</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Revenue trend over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Processor</CardTitle>
            <CardDescription>Revenue breakdown by processor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByProcessor}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Bar dataKey="Processor A" fill="#10b981" />
                  <Bar dataKey="Processor B" fill="#3b82f6" />
                  <Bar dataKey="Processor C" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>Detailed list of all sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Processor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.orderId}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.quality}</TableCell>
                  <TableCell>{transaction.processor}</TableCell>
                  <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

