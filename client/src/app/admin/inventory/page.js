// app/admin/inventory/page.jsx
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FileDown, FileUp, MoreHorizontal, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- Mock Data based on your Mongoose Schema ---
// Replace this with your actual data fetching logic.
const mockData = [
  {
    _id: "prod_1",
    name: "Fashion-Ka Plzara-mesh Round Neck Black Embroidery",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    price: 374.0,
    stock: 12,
    sku: "IN3245DFTU",
    category: "Clothing",
  },
  {
    _id: "prod_2",
    name: "Women Floral Print Dress Spaghetti Strap V Neck Mini Dress",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    price: 176.98,
    stock: 10,
    sku: "IN3245DFTU",
    category: "Clothing",
  },
  {
    _id: "prod_3",
    name: "Men's Poly Cotton Digital Printed Stitched Half Sleeve Shirt",
    image: "https://i.pravatar.cc/150?u=a092581f4e29026700d",
    price: 195.38,
    stock: 0,
    sku: "IN3245DFTU",
    category: "Clothing",
  },
  {
    _id: "prod_4",
    name: "Formal Pants for Men | Stylish Slim-Fit Men's Wear Trousers",
    image: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    price: 134.78,
    stock: 43,
    sku: "IN3245DFTU",
    category: "Clothing",
  },
  {
    _id: "prod_5",
    name: "Baby Boys & Baby Girl's Jumbo The Elephant Dungaree",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026708c",
    price: 324.0,
    stock: 74,
    sku: "IN3245DFTU",
    category: "Clothing",
  },
];

// --- Column Definitions for TanStack Table ---
// The JSDoc comment below provides type hints to your editor
/** @type {import("@tanstack/react-table").ColumnDef<any>[]} */
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={row.original.image} alt={row.original.name} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="font-medium capitalize">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.category}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.stock > 0 ? "active" : "out_of_stock";
      const statusText = status === "active" ? "Active" : "Out of stock";
      return (
        <Badge variant={status === "active" ? "outline" : "destructive"}>
          {statusText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => <div>{`${row.getValue("stock")} in stock`}</div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit product</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function InventoryPage() {
  const [data, setData] = React.useState(() => [...mockData]);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FileDown className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileUp className="h-3.5 w-3.5" />
            <span>Import</span>
          </Button>
          {/* Using your brand color for the primary action */}
          <Button
            size="sm"
            className="gap-1 bg-[#730000] hover:bg-brand-darkred text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="out_of_stock">Out of stock</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center py-4">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter products by name..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                      table
                        .getColumn("name")
                        ?.setFilterValue(event.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
