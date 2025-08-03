"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  Sector,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import api from "@/lib/axiosInstance";

const fetchStatsCards = async () => {
  const { data } = await api.get("/products/stats-cards");
  return data.data;
};

const fetchRevenueData = async (period) => {
  const { data } = await api.get(`/orders/revenue?period=${period}`);
  return data.data;
};

const fetchRevenueByCategory = async (period) => {
  const { data } = await api.get(
    `/orders/revenue-by-category?period=${period}`
  );
  return data.data;
};

const fetchProductCountByCategory = async () => {
  const { data } = await api.get("/products/product-count-by-category");
  return data.data;
};

// Custom Active Shape for Pie Chart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Custom Label for Pie Chart
const CustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  index,
  data,
}) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const ex = cx + (outerRadius + 20) * cos;
  const ey = cy + (outerRadius + 20) * sin;
  const textAnchor = cos >= 0 ? "start" : "end";

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const actualPercent = (data[index].revenue / totalRevenue) * 100;

  return (
    <g>
      <polyline
        points={`${cx + cos * outerRadius},${
          cy + sin * outerRadius
        } ${ex},${ey}`}
        stroke="#ccc"
        fill="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        fill="#333"
        textAnchor={textAnchor}
        dominantBaseline="central"
      >
        {`${actualPercent.toFixed(1)}%`}
      </text>
    </g>
  );
};

export default function AdminDashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = React.useState("month");
  const [categoryPeriod, setCategoryPeriod] = React.useState("all");
  const [activeIndex, setActiveIndex] = React.useState(null);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStatsCards,
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["dashboard-revenue", revenuePeriod],
    queryFn: () => fetchRevenueData(revenuePeriod),
  });

  const { data: revenueByCategory, isLoading: isLoadingCatRevenue } = useQuery({
    queryKey: ["dashboard-revenue-by-category", categoryPeriod],
    queryFn: () => fetchRevenueByCategory(categoryPeriod),
  });

  const { data: productCountByCategory, isLoading: isLoadingCatCount } =
    useQuery({
      queryKey: ["dashboard-product-count-by-category"],
      queryFn: fetchProductCountByCategory,
    });

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1943",
  ];
  const isLoading =
    isLoadingStats ||
    isLoadingRevenue ||
    isLoadingCatRevenue ||
    isLoadingCatCount;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProducts || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeProducts || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Products
            </CardTitle>
            <XCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.inactiveProducts || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.outOfStockProducts || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Line Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Overview (Delivered Orders)</CardTitle>
          <Select
            defaultValue="month"
            value={revenuePeriod}
            onValueChange={setRevenuePeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `NPR ${value.toLocaleString("en-IN")}`
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("en-In", {
                    style: "currency",
                    currency: "NPR",
                  }).format(value)
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16A34A"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Category Revenue Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue by Category</CardTitle>
            <Select
              defaultValue="all"
              value={categoryPeriod}
              onValueChange={setCategoryPeriod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={revenueByCategory}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={true}
                  label={({ ...props }) => (
                    <CustomLabel {...props} data={revenueByCategory} />
                  )}
                >
                  {revenueByCategory?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "NPR",
                    }).format(value)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Product Count Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={324}>
              <BarChart data={productCountByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  fontSize={12}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />

                <Bar dataKey="count" name="Product Count">
                  <LabelList dataKey="count" position="top" />
                  {productCountByCategory?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
