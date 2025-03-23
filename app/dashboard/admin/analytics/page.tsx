"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Colors for the chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

// Sample data for revenue
const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 16000 },
  { month: "Apr", revenue: 19000 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 25000 },
  { month: "Jul", revenue: 27000 },
  { month: "Aug", revenue: 26000 },
  { month: "Sep", revenue: 29000 },
  { month: "Oct", revenue: 32000 },
  { month: "Nov", revenue: 34000 },
  { month: "Dec", revenue: 38000 },
]

// Sample data for inventory
const inventoryData = [
  { month: "Jan", "Raw Materials": 12000, "Processed Products": 8000 },
  { month: "Feb", "Raw Materials": 13000, "Processed Products": 9000 },
  { month: "Mar", "Raw Materials": 14000, "Processed Products": 10000 },
  { month: "Apr", "Raw Materials": 15000, "Processed Products": 11000 },
  { month: "May", "Raw Materials": 16000, "Processed Products": 12000 },
  { month: "Jun", "Raw Materials": 17000, "Processed Products": 13000 },
  { month: "Jul", "Raw Materials": 18000, "Processed Products": 14000 },
  { month: "Aug", "Raw Materials": 19000, "Processed Products": 15000 },
  { month: "Sep", "Raw Materials": 20000, "Processed Products": 16000 },
  { month: "Oct", "Raw Materials": 21000, "Processed Products": 17000 },
  { month: "Nov", "Raw Materials": 22000, "Processed Products": 18000 },
  { month: "Dec", "Raw Materials": 23000, "Processed Products": 19000 },
]

// Sample data for product sales
const productSalesData = [
  { name: "Cassava Flour", value: 45000 },
  { name: "Cassava Starch", value: 35000 },
  { name: "Cassava Chips", value: 20000 },
  { name: "Other Products", value: 10000 },
]

// Sample data for transportation
const transportationData = [
  { month: "Jan", volume: 5000, cost: 2500 },
  { month: "Feb", volume: 5500, cost: 2750 },
  { month: "Mar", volume: 6000, cost: 3000 },
  { month: "Apr", volume: 6500, cost: 3250 },
  { month: "May", volume: 7000, cost: 3500 },
  { month: "Jun", volume: 7500, cost: 3750 },
  { month: "Jul", volume: 8000, cost: 4000 },
  { month: "Aug", volume: 8500, cost: 4250 },
  { month: "Sep", volume: 9000, cost: 4500 },
  { month: "Oct", volume: 9500, cost: 4750 },
  { month: "Nov", volume: 10000, cost: 5000 },
  { month: "Dec", volume: 10500, cost: 5250 },
]

// Sample data for supplier performance
const supplierPerformanceData = [
  { month: "Jan", "Supplier A": 95, "Supplier B": 88, "Supplier C": 92 },
  { month: "Feb", "Supplier A": 94, "Supplier B": 90, "Supplier C": 91 },
  { month: "Mar", "Supplier A": 96, "Supplier B": 89, "Supplier C": 93 },
  { month: "Apr", "Supplier A": 93, "Supplier B": 91, "Supplier C": 90 },
  { month: "May", "Supplier A": 95, "Supplier B": 92, "Supplier C": 94 },
  { month: "Jun", "Supplier A": 97, "Supplier B": 93, "Supplier C": 92 },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")

  // Get data based on time range selection (in a real app, this would filter the data)
  const getFilteredData = (data: any[]) => {
    if (timeRange === "quarter") {
      return data.slice(-3)
    } else if (timeRange === "month") {
      return data.slice(-1)
    } else {
      return data
    }
  }

  const filteredRevenueData = getFilteredData(revenueData)
  const filteredInventoryData = getFilteredData(inventoryData)
  const filteredTransportationData = getFilteredData(transportationData)
  const filteredSupplierData = getFilteredData(supplierPerformanceData)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and reporting for your supply chain</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$283,000</div>
            <p className="text-xs text-muted-foreground">+12.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,000</div>
            <p className="text-xs text-muted-foreground">+5.2% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transportation Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$46,500</div>
            <p className="text-xs text-muted-foreground">-3.1% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">+1.8% from last year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredRevenueData}
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
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productSalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productSalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Raw materials vs. processed products over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredInventoryData}
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
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Raw Materials"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="Processed Products"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>Monthly inventory turnover rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", turnover: 3.2 },
                        { month: "Feb", turnover: 3.4 },
                        { month: "Mar", turnover: 3.1 },
                        { month: "Apr", turnover: 3.5 },
                        { month: "May", turnover: 3.6 },
                        { month: "Jun", turnover: 3.8 },
                        { month: "Jul", turnover: 3.7 },
                        { month: "Aug", turnover: 3.9 },
                        { month: "Sep", turnover: 4.0 },
                        { month: "Oct", turnover: 4.2 },
                        { month: "Nov", turnover: 4.3 },
                        { month: "Dec", turnover: 4.5 },
                      ].slice(timeRange === "quarter" ? -3 : timeRange === "month" ? -1 : 0)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="turnover" stroke="#8884d8" name="Turnover Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transportation Volume & Cost</CardTitle>
                <CardDescription>Monthly transportation volume and associated costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredTransportationData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#8884d8" name="Volume (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Processing Efficiency</CardTitle>
                <CardDescription>Monthly processing efficiency by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jul", "Cassava Flour": 85, "Cassava Starch": 78, "Cassava Chips": 92 },
                        { month: "Aug", "Cassava Flour": 87, "Cassava Starch": 80, "Cassava Chips": 91 },
                        { month: "Sep", "Cassava Flour": 84, "Cassava Starch": 82, "Cassava Chips": 90 },
                        { month: "Oct", "Cassava Flour": 86, "Cassava Starch": 83, "Cassava Chips": 94 },
                        { month: "Nov", "Cassava Flour": 88, "Cassava Starch": 85, "Cassava Chips": 92 },
                        { month: "Dec", "Cassava Flour": 90, "Cassava Starch": 87, "Cassava Chips": 95 },
                      ].slice(timeRange === "quarter" ? -3 : timeRange === "month" ? -1 : 0)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[50, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} />
                      <Legend />
                      <Bar dataKey="Cassava Flour" fill="#8884d8" />
                      <Bar dataKey="Cassava Starch" fill="#82ca9d" />
                      <Bar dataKey="Cassava Chips" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Monthly performance scores by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredSupplierData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Performance Score"]} />
                      <Legend />
                      <Line type="monotone" dataKey="Supplier A" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Supplier B" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="Supplier C" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Raw Material Sources</CardTitle>
                <CardDescription>Raw material sourcing by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Supplier A", value: 15000 },
                          { name: "Supplier B", value: 12000 },
                          { name: "Supplier C", value: 10000 },
                          { name: "Other Suppliers", value: 5000 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "Supplier A", value: 15000 },
                          { name: "Supplier B", value: 12000 },
                          { name: "Supplier C", value: 10000 },
                          { name: "Other Suppliers", value: 5000 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, "Raw Material"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Map</CardTitle>
          <CardDescription>Geographic visualization of your entire supply chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Interactive Supply Chain Map</p>
              <p className="text-sm text-gray-400">Showing suppliers, warehouses, and distribution routes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

