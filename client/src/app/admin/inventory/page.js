"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MoreHorizontal, Plus, Search, TagIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/lib/axiosInstance";
import ProductDelete from "@/components/admin/product-delete";
import ProductDetailsDialog from "@/components/admin/productDetailsDialog";
import { DataTablePagination } from "@/components/DataTablePagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProducts = async (tableState) => {
  const params = new URLSearchParams();

  params.append("page", tableState.pagination.pageIndex + 1);
  params.append("limit", tableState.pagination.pageSize);

  if (tableState.sorting.length > 0) {
    const sortString = tableState.sorting
      .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
      .join(",");
    params.append("sort", sortString);
  }

  if (tableState.globalFilter) {
    params.append("q", tableState.globalFilter);
  }

  if (tableState.tabFilter !== "all") {
    if (tableState.tabFilter === "inactive") {
      params.append("status", "inactive");
    } else if (tableState.tabFilter === "out_of_stock") {
      params.append("stock", "0");
    }
  }

  const { data } = await api.get(`/products?${params.toString()}`);
  return data;
};

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 500);
  const [tabFilter, setTabFilter] = React.useState("all");
  const [rowSelection, setRowSelection] = React.useState({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productIdToDelete, setProductIdToDelete] = React.useState(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] =
    React.useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] =
    React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-products",
      pagination,
      sorting,
      debouncedGlobalFilter,
      tabFilter,
    ],
    queryFn: () =>
      fetchProducts({
        pagination,
        sorting,
        globalFilter: debouncedGlobalFilter,
        tabFilter,
      }),
    keepPreviousData: true,
  });

  const products = data?.products ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;
  const totalProducts = data?.pagination?.totalProducts ?? 0;

  const triggerRefetch = () =>
    queryClient.invalidateQueries(["admin-products"]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      triggerRefetch();
      toast.success("Product deleted successfully.", {
        toasterId: "generalToaster",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedIds = Object.keys(rowSelection).map(
        (rowIndex) => table.getRowModel().rows[rowIndex].original._id
      );
      await Promise.all(selectedIds.map((id) => api.delete(`/products/${id}`)));
      triggerRefetch();
      setRowSelection({});
      toast.success("Selected products deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete selected products.");
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (product) => {
    if (product.status === "inactive" && product.stock === 0) {
      setShowStatusChangeDialog(true);
      return;
    }
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/products/${product._id}/toggleStatus`, {
        status: newStatus,
      });
      triggerRefetch();
      toast.success(`Product status changed to ${newStatus}.`);
    } catch (error) {
      toast.error("Failed to toggle product status.");
    }
  };

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
                src={`${API_URL}/uploads/${row.original.image}`}
                className="object-contain"
                alt={row.original.name}
              />
              <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-medium capitalize">
                {row.getValue("name")}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.original.category}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "effectivePrice",
        header: "Price",
        cell: ({ row }) => {
          const { price, effectivePrice, isOnSale } = row.original;
          return (
            <div className="flex flex-col items-start">
              <span className="font-medium">
                NPR{" "}
                {effectivePrice?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
              {isOnSale && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TagIcon className="h-3 w-3 text-green-500" />
                  <span className="line-through">
                    NPR{" "}
                    {price?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const product = row.original;
          const status = product.status;
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer font-semibold",
                    status === "active"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  )}
                >
                  {status}
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleStatusChange(product)}
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
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <ProductDetailsDialog product={row.original} />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  router.push(
                    `/admin/inventory/edit-product?id=${row.original._id}`
                  )
                }
              >
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleStatusChange(row.original)}
              >
                Toggle Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => {
                  setProductIdToDelete(row.original._id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: products,
    columns,
    pageCount,
    state: { pagination, sorting, globalFilter, rowSelection },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          size="sm"
          className="gap-1 bg-[#AF0000] hover:bg-[#730000] cursor-pointer"
          onClick={() => router.push("/admin/inventory/add-product")}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => {
          setTabFilter(value);
          table.setPageIndex(0);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
        </TabsList>
        <TabsContent value={tabFilter} className="mt-4">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage your products and their performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between py-4 gap-4">
                <div className="relative flex-1 md:grow-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 w-full md:w-[300px]"
                  />
                </div>
                <Select
                  onValueChange={(value) =>
                    value
                      ? setSorting([
                          {
                            id: value.split("-")[0],
                            desc: value.split("-")[1] === "desc",
                          },
                        ])
                      : setSorting([])
                  }
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest</SelectItem>
                    <SelectItem value="effectivePrice-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="effectivePrice-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="stock-asc">
                      Stock: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Loading data...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
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
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                  >
                    Delete Selected
                  </Button>
                )}
                <div>
                  <DataTablePagination table={table} />
                </div>
              </div>
              <p className="text-sm font-semibold font-sans">
                Total Products: {totalProducts}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProductDelete
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
              Cannot make an item active with no stock in inventory.
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
              This will permanently delete {Object.keys(rowSelection).length}{" "}
              selected products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
