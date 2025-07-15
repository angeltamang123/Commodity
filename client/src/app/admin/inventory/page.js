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
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProductDelete from "@/components/product-delete";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/productDetailsDialog";
import api from "@/lib/axiosInstance";

export default function InventoryPage() {
  const [allProducts, setAllProducts] = React.useState([]);
  const [inactiveProducts, setInactiveProducts] = React.useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = React.useState([]);
  // States for all products table
  const [allSorting, setAllSorting] = React.useState([]);
  const [allColumnFilters, setAllColumnFilters] = React.useState([]);
  const [allColumnVisibility, setAllColumnVisibility] = React.useState({});
  const [allRowSelection, setAllRowSelection] = React.useState({});

  // States for inactive products table
  const [inactiveSorting, setInactiveSorting] = React.useState([]);
  const [inactiveColumnFilters, setInactiveColumnFilters] = React.useState([]);
  const [inactiveColumnVisibility, setInactiveColumnVisibility] =
    React.useState({});
  const [inactiveRowSelection, setInactiveRowSelection] = React.useState({});

  // States for out of stock products table
  const [outOfStockSorting, setOutOfStockSorting] = React.useState([]);
  const [outOfStockColumnFilters, setOutOfStockColumnFilters] = React.useState(
    []
  );
  const [outOfStockColumnVisibility, setOutOfStockColumnVisibility] =
    React.useState({});
  const [outOfStockRowSelection, setOutOfStockRowSelection] = React.useState(
    {}
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productIdToDelete, setProductIdToDelete] = React.useState(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] =
    React.useState(false);
  const [selectedForBulkDelete, setSelectedForBulkDelete] = React.useState({});
  const [currentTable, setCurrentTable] = React.useState(null);
  const [showStatusChangeDialog, setShowStatusChangeDialog] =
    React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await api.get(`/products`);
    if (data) {
      setAllProducts(data.products);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allProducts) {
      const inactive = allProducts.filter((product) => {
        return product.status === "inactive";
      });
      const outOfStock = allProducts.filter((product) => {
        return product.stock === 0;
      });

      setInactiveProducts(inactive);
      setOutOfStockProducts(outOfStock);
    }
  }, [allProducts]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchData();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleStatusChange = async (productToToggle) => {
    const currentStatus = productToToggle.status;

    // Prevent changing status if inactive and stock is 0 (as per your logic)
    if (currentStatus === "inactive" && productToToggle.stock === 0) {
      setShowStatusChangeDialog(true);
      return;
    }
    const toggledStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await api.patch(`/products/${productToToggle._id}/toggleStatus`, {
        status: toggledStatus,
      });

      setAllProducts((prevData) =>
        prevData.map((p) =>
          p._id === productToToggle._id ? { ...p, status: toggledStatus } : p
        )
      );

      toast.success(`Product status toggled to ${toggledStatus}`);
    } catch (error) {
      toast.error(`Failed to toggle product status. ${error}`);
    }
  };

  const handleDeleteSelected = async (selectedRows, tableInstance) => {
    try {
      const selectedIds = Object.keys(selectedRows).map(
        (rowIndex) => tableInstance.getRowModel().rows[rowIndex].original._id
      );

      await Promise.all(selectedIds.map((id) => api.delete(`/products/${id}`)));

      fetchData();
      toast.success("Selected products deleted successfully");
    } catch (error) {
      console.error("Error deleting selected products:", error);
      toast.error("Failed to delete selected products");
    }
  };

  const columns = [
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
            <AvatarImage
              src={
                process.env.NEXT_PUBLIC_API_URL +
                "/uploads/" +
                row.original.image
              }
              className="object-contain"
              alt={row.original.name}
            />
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
        const formatted = new Intl.NumberFormat("ne-NP", {
          style: "currency",
          currency: "NPR",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                className={cn(
                  "cursor-pointer",
                  status === "active" ? "bg-green-300" : "bg-yellow-200"
                )}
                variant={status === "active" && "outline"}
              >
                {status}
              </Badge>
            </PopoverTrigger>
            <PopoverContent>
              <Button
                onClick={() => {
                  handleStatusChange(row.original);
                }}
                className={cn(
                  "w-full text-black hover:bg-gray-400",
                  status === "active" ? "bg-yellow-200" : "bg-green-300"
                )}
              >
                Toggle to {status === "active" ? "Inactive" : "Active"}
              </Button>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Inventory",
      cell: ({ row }) => <div>{`${row.getValue("stock")} in stock`}</div>,
    },
    // {
    //   accessorKey: "sku",
    //   header: "SKU",
    // },
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
              <DropdownMenuItem asChild>
                <ProductDetailsDialog product={product} />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(
                    `/admin/inventory/edit-product?id=${product._id}`
                  );
                }}
              >
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={(e) => {
                  setProductIdToDelete(product._id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: allProducts,
    columns,
    onSortingChange: setAllSorting,
    onColumnFiltersChange: setAllColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setAllColumnVisibility,
    onRowSelectionChange: setAllRowSelection,
    state: {
      sorting: allSorting,
      columnFilters: allColumnFilters,
      columnVisibility: allColumnVisibility,
      rowSelection: allRowSelection,
    },
  });

  const inactiveTable = useReactTable({
    data: inactiveProducts,
    columns,
    onSortingChange: setInactiveSorting,
    onColumnFiltersChange: setInactiveColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setInactiveColumnVisibility,
    onRowSelectionChange: setInactiveRowSelection,
    state: {
      sorting: inactiveSorting,
      columnFilters: inactiveColumnFilters,
      columnVisibility: inactiveColumnVisibility,
      rowSelection: inactiveRowSelection,
    },
  });

  const outOfStockTable = useReactTable({
    data: outOfStockProducts,
    columns,
    onSortingChange: setOutOfStockSorting,
    onColumnFiltersChange: setOutOfStockColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setOutOfStockColumnVisibility,
    onRowSelectionChange: setOutOfStockRowSelection,
    state: {
      sorting: outOfStockSorting,
      columnFilters: outOfStockColumnFilters,
      columnVisibility: outOfStockColumnVisibility,
      rowSelection: outOfStockRowSelection,
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          size="sm"
          className="gap-1 bg-[#A1040B] hover:bg-[#730000] text-white"
          onClick={() => {
            router.push("/admin/inventory/add-product");
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="out_of_stock">Out of stock</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-6">
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
                          {loading ? "Loading data" : "No results."}
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
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedForBulkDelete(table.getState().rowSelection);
                      setCurrentTable(table);
                      setIsBulkDeleteDialogOpen(true);
                    }}
                  >
                    Delete Selected
                  </Button>
                )}
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
        <TabsContent value="inactive">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-6">
              <div className="flex items-center py-4">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter products by name..."
                    value={
                      inactiveTable.getColumn("name")?.getFilterValue() ?? ""
                    }
                    onChange={(event) =>
                      inactiveTable
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
                    {inactiveTable.getHeaderGroups().map((headerGroup) => (
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
                    {inactiveTable.getRowModel().rows?.length ? (
                      inactiveTable.getRowModel().rows.map((row) => (
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
                          {loading ? "Loading data" : "No results."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {inactiveTable.getFilteredSelectedRowModel().rows.length} of{" "}
                  {inactiveTable.getFilteredRowModel().rows.length} row(s)
                  selected.
                </div>
                {inactiveTable.getFilteredSelectedRowModel().rows.length >
                  0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedForBulkDelete(
                        inactiveTable.getState().rowSelection
                      );
                      setCurrentTable(inactiveTable);
                      setIsBulkDeleteDialogOpen(true);
                    }}
                  >
                    Delete Selected
                  </Button>
                )}
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inactiveTable.previousPage()}
                    disabled={!inactiveTable.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inactiveTable.nextPage()}
                    disabled={!inactiveTable.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="out_of_stock">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-6">
              <div className="flex items-center py-4">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter products by name..."
                    value={
                      outOfStockTable.getColumn("name")?.getFilterValue() ?? ""
                    }
                    onChange={(event) =>
                      outOfStockTable
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
                    {outOfStockTable.getHeaderGroups().map((headerGroup) => (
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
                    {outOfStockTable.getRowModel().rows?.length ? (
                      outOfStockTable.getRowModel().rows.map((row) => (
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
                          {loading ? "Loading data" : "No results."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {outOfStockTable.getFilteredSelectedRowModel().rows.length} of{" "}
                  {outOfStockTable.getFilteredRowModel().rows.length} row(s)
                  selected.
                </div>
                {outOfStockTable.getFilteredSelectedRowModel().rows.length >
                  0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedForBulkDelete(
                        outOfStockTable.getState().rowSelection
                      );
                      setCurrentTable(outOfStockTable);
                      setIsBulkDeleteDialogOpen(true);
                    }}
                  >
                    Delete Selected
                  </Button>
                )}
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => outOfStockTable.previousPage()}
                    disabled={!outOfStockTable.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => outOfStockTable.nextPage()}
                    disabled={!outOfStockTable.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Product Delete Dialog */}
      <ProductDelete
        id={productIdToDelete}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => handleDelete(productIdToDelete)}
      />
      <AlertDialog
        open={showStatusChangeDialog}
        onOpenChange={setShowStatusChangeDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invalid Action</AlertDialogTitle>
            <AlertDialogDescription>
              Cannot make an item active with no stock in inventory!!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {Object.keys(selectedForBulkDelete).length} selected products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteSelected(selectedForBulkDelete, currentTable);
                setIsBulkDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
