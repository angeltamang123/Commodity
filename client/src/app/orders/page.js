"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

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
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";

import api from "@/lib/axiosInstance";
import { DataTablePagination } from "@/components/DataTablePagination";
import { cn } from "@/lib/utils";
import CustomNavbar from "@/components/navbar";

const fetchOrders = async (tableState) => {
  const params = new URLSearchParams();
  params.append("page", tableState.pagination.pageIndex + 1);
  params.append("limit", tableState.pagination.pageSize);
  if (tableState.sorting.length > 0) {
    const s = tableState.sorting[0];
    params.append("sort", `${s.id}:${s.desc ? "desc" : "asc"}`);
  }
  if (tableState.globalFilter) {
    params.append("q", tableState.globalFilter);
  }
  const { data } = await api.get(`/orders/my-orders/?${params.toString()}`);
  return data;
};

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 500);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowSelection, setRowSelection] = React.useState({});

  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const [orderToCancel, setOrderToCancel] = React.useState(null);
  const [isBulkCancelDialogOpen, setIsBulkCancelDialogOpen] =
    React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "my-orders",
      pagination,
      sorting,
      debouncedGlobalFilter,
      statusFilter,
    ],
    queryFn: () =>
      fetchOrders({
        pagination,
        sorting,
        globalFilter: debouncedGlobalFilter,
        statusFilter,
      }),
    keepPreviousData: true,
  });

  const orders = data?.orders ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;
  const totalOrders = data?.pagination?.totalOrders ?? 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "departed":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCancellable = (status) =>
    status === "pending" || status === "processing";

  const handleCancelOrder = async () => {
    if (!orderToCancel || !isCancellable(orderToCancel.status)) return;
    setIsCancelling(true);
    toast
      .promise(
        api.patch(`/orders/${orderToCancel._id}/status`, {
          status: "cancelled",
        }),
        {
          loading: "Cancelling order...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            setOrderToCancel(null);
            setIsCancelDialogOpen(false);
            return "Order has been cancelled successfully.";
          },
          error: "Failed to cancel order.",
        }
      )
      .finally(() => {
        setIsCancelling(false);
      });
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
        accessorKey: "_id",
        header: "Order ID",
        cell: ({ row }) => (
          <HoverCard openDelay={300} closeDelay={300}>
            <HoverCardTrigger asChild>
              <span className="font-mono block truncate max-w-[50px] text-xs cursor-pointer hover:underline">
                #{row.original._id}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm w-fit">
              <div className="flex flex-col gap-1">
                <span>Full Order ID:</span>
                <span
                  className="font-mono cursor-pointer hover:text-[#AF0000] text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original._id);
                    toast.success("Order ID copied to clipboard!");
                  }}
                >
                  {row.original._id}
                </span>
              </div>
            </HoverCardContent>
          </HoverCard>
        ),
      },
      {
        accessorKey: "items",
        header: "Product(s)",
        cell: ({ row }) => {
          const items = row.original.items;
          return (
            <HoverCard openDelay={300} closeDelay={300}>
              <HoverCardTrigger asChild>
                <div className="max-w-[200px] cursor-pointer hover:underline truncate">
                  {items[0].name}
                  {items.length > 1 && `, +${items.length - 1} more`}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product} className="flex items-center gap-4">
                      {item.productDetails?.image && (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.productDetails.image}`}
                            alt={item.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x NPR{" "}
                          {item.price.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
      {
        accessorKey: "deliveryAddress",
        header: "Address",
        cell: ({ row }) => {
          const address = row.original.deliveryAddress;
          if (!address || !address.formattedAddress) {
            return <div className="text-muted-foreground">N/A</div>;
          }
          return (
            <HoverCard openDelay={300} closeDelay={300}>
              <HoverCardTrigger asChild>
                <div className="max-w-[200px] cursor-pointer hover:underline truncate">
                  {address.formattedAddress}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Delivery Address</h4>
                  <p className="text-sm">{address.formattedAddress}</p>
                  <p className="text-xs text-muted-foreground">
                    {address.name && `Name: ${address.name}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.city && `City: ${address.city}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.country && `Country: ${address.country}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.postcode && `Postcode: ${address.postcode}`}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
      {
        accessorKey: "totalAmount",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => (
          <div className="text-right font-semibold">
            NPR{" "}
            {row.getValue("totalAmount").toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => {
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="group p-0 h-auto"
              >
                <span className="flex items-center gap-1">
                  Date
                  {column.getIsSorted() === "asc" && (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  )}
                  {column.getIsSorted() === "desc" && (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  )}
                  {!column.getIsSorted() && (
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  )}
                </span>
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-right">
            {format(new Date(row.getValue("updatedAt")), "MMM d, yyyy")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn("capitalize", getStatusColor(row.original.status))}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setOrderToCancel(order);
                    setIsCancelDialogOpen(true);
                  }}
                  disabled={!isCancellable(order.status)}
                  className={cn(
                    "text-red-600 focus:text-red-600",
                    !isCancellable(order.status) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
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

  const areAllSelectedOrdersCancellable = React.useMemo(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return false;
    return selectedRows.every((row) => isCancellable(row.original.status));
  }, [table.getFilteredSelectedRowModel().rows]);

  const handleBulkCancel = async () => {
    setIsCancelling(true);
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedOrders = selectedRows.map((row) => row.original);

      const allCancellable = selectedOrders.every((order) =>
        isCancellable(order.status)
      );
      if (!allCancellable) {
        toast.error("Some selected orders cannot be cancelled.");
        setIsCancelling(false);
        setIsBulkCancelDialogOpen(false);
        return;
      }

      const updatePromises = selectedOrders.map((order) =>
        api.patch(`/orders/${order._id}/status`, { status: "cancelled" })
      );

      await Promise.all(updatePromises);

      toast.success(`${selectedOrders.length} orders cancelled successfully.`);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      setRowSelection({});
    } catch (error) {
      toast.error("Failed to cancel selected orders.");
      console.error("Bulk cancellation failed:", error);
    } finally {
      setIsCancelling(false);
      setIsBulkCancelDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <CustomNavbar />
      <div className="h-full flex-1 flex flex-col gap-6 w-full">
        <Card className="h-full rounded-none px-0">
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>View your orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pb-4 gap-2">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ID or Product"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm font-semibold font-sans mr-8">
                Total Orders: {totalOrders}
              </p>
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
                        Loading orders...
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
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center w-full justify-between space-x-2 mt-4 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setIsBulkCancelDialogOpen(true)}
                  disabled={!areAllSelectedOrdersCancellable || isCancelling}
                  className="bg-[#AF0000] hover:bg-[#730000]"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Selected Orders"}
                </Button>
              )}
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>

        <AlertDialog
          open={isCancelDialogOpen}
          onOpenChange={(value) => {
            setIsCancelDialogOpen(value);
            if (!value) setOrderToCancel(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel order{" "}
                <span className="font-semibold text-foreground font-mono">
                  #{orderToCancel?._id}
                </span>
                . This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="hover:cursor-pointer"
                disabled={isCancelling}
              >
                Go Back
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="bg-[#AF0000] hover:bg-[#730000] hover:cursor-pointer"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          open={isBulkCancelDialogOpen}
          onOpenChange={(value) => {
            setIsBulkCancelDialogOpen(value);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel{" "}
                <span className="font-semibold text-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} selected
                  orders
                </span>
                . This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="hover:cursor-pointer"
                disabled={isCancelling}
              >
                Go Back
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkCancel}
                disabled={isCancelling || !areAllSelectedOrdersCancellable}
                className="bg-[#AF0000] hover:bg-[#730000] hover:cursor-pointer"
              >
                {isCancelling ? "Cancelling..." : "Confirm All"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
