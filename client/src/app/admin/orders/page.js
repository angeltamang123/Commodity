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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import api from "@/lib/axiosInstance";
import { DataTablePagination } from "@/components/DataTablePagination";
import { cn } from "@/lib/utils";

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
  if (tableState.statusFilter && tableState.statusFilter !== "all") {
    params.append("status", tableState.statusFilter);
  }
  const { data } = await api.get(`/orders?${params.toString()}`);
  return data;
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 500);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowSelection, setRowSelection] = React.useState({});

  const [isBulkStatusDialogOpen, setIsBulkStatusDialogOpen] =
    React.useState(false);
  const [bulkStatus, setBulkStatus] = React.useState(null);
  const [isUpdatingBulk, setIsUpdatingBulk] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-orders",
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

  const handleStatusChange = async (orderId, newStatus) => {
    toast.promise(
      api.patch(`/orders/${orderId}/status`, { status: newStatus }),
      {
        loading: "Updating status...",
        success: (res) => {
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
          return `Order status updated to ${res.data.data.status}.`;
        },
        error: "Failed to update status.",
      }
    );
  };

  const handleBulkStatusChange = async () => {
    setIsUpdatingBulk(true);
    try {
      const selectedIds = Object.keys(rowSelection).map(
        (rowIndex) => table.getRowModel().rows[rowIndex].original._id
      );

      const updatePromises = selectedIds.map((orderId) =>
        api.patch(`/orders/${orderId}/status`, { status: bulkStatus })
      );

      await Promise.all(updatePromises);

      toast.success(`${selectedIds.length} orders updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setRowSelection({});
    } catch (error) {
      toast.error("Failed to update status for selected orders.");
      console.error("Bulk status update failed:", error);
    } finally {
      setIsUpdatingBulk(false);
      setIsBulkStatusDialogOpen(false);
      setBulkStatus(null);
    }
  };

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

  const statuses = [
    "pending",
    "processing",
    "departed",
    "delivered",
    "cancelled",
  ];

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
        accessorKey: "userDetails.fullName",
        header: "Customer",
        cell: ({ row }) => {
          const user = row.original.userDetails;
          if (!user) {
            return <div className="text-muted-foreground">User not found</div>;
          }
          return (
            <HoverCard openDelay={300} closeDelay={300}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer ">
                  <span className="max-w-[200px] cursor-pointer hover:underline truncate">
                    {user.fullName}
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium">{user.fullName}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {user.emailId}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {user.phoneNumber || "N/A"}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
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
                            src={`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/uploads/${item.productDetails.image}`}
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
        accessorKey: "createdAt",
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
            {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const order = row.original;
          const statuses = [
            "pending",
            "processing",
            "departed",
            "delivered",
            "cancelled",
          ];

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

          return (
            <Select
              value={order.status}
              onValueChange={(newStatus) =>
                handleStatusChange(order._id, newStatus)
              }
            >
              <SelectTrigger
                className={cn(
                  "w-32 justify-between cursor-pointer capitalize transition-colors",
                  getStatusColor(order.status)
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    <Badge
                      className={cn(
                        "capitalize hover:bg-white hover:cursor-pointer",
                        getStatusColor(s)
                      )}
                    >
                      {s}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
          <CardDescription>
            View, filter, and update customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-4 gap-2">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ID or Customer..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="departed">Departed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
          <div className="flex items-center w-full justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Select
                onValueChange={(value) => {
                  setBulkStatus(value);
                  setIsBulkStatusDialogOpen(true);
                }}
                value={bulkStatus || ""}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bulk Change Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      <Badge
                        className={cn(
                          "capitalize hover:bg-white hover:cursor-pointer",
                          getStatusColor(s)
                        )}
                      >
                        {s}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div>
              <DataTablePagination table={table} />
            </div>
          </div>
          <p className="text-sm font-semibold font-sans">
            Total Orders: {totalOrders}
          </p>
        </CardContent>
      </Card>

      <AlertDialog
        open={isBulkStatusDialogOpen}
        onOpenChange={(value) => {
          setIsBulkStatusDialogOpen(value);
          if (!value) {
            setBulkStatus("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of{" "}
              <span className="font-semibold text-foreground">
                {table.getFilteredSelectedRowModel().rows.length} selected
                orders
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground capitalize">
                {bulkStatus}
              </span>
              . This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:cursor-pointer"
              disabled={isUpdatingBulk}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkStatusChange}
              disabled={isUpdatingBulk}
              className="bg-[#AF0000] hover:bg-[#730000] hover:cursor-pointer"
            >
              {isUpdatingBulk ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
