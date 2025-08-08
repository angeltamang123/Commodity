"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { markAllSeen } from "@/redux/reducerSlices/notificationSlice";
import { Bell, ShoppingCart, AlertTriangle, XCircle } from "lucide-react";

const fetchNotifications = async ({ pageParam = 0 }) => {
  const res = await api.get(`/notifications?limit=20&skip=${pageParam}`);
  return res.data;
};

const getNotificationTypeProps = (type) => {
  switch (type) {
    case "Order Cancelled":
      return {
        label: "bg-red-500",
        icon: <XCircle className="h-4 w-4" />,
      };
    case "New Order":
      return {
        label: "bg-green-500",
        icon: <ShoppingCart className="h-4 w-4" />,
      };
    case "Order Update":
      return {
        label: "bg-orange-500",
        icon: <AlertTriangle className="h-4 w-4" />,
      };
    case "System":
    default:
      return {
        label: "bg-gray-500",
        icon: <Bell className="h-4 w-4" />,
      };
  }
};

const Notifications = () => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return allPages.length * 20;
      },
      initialPageParam: 0,
    });

  const markAllAsSeen = async () => {
    await api.post("/notifications/mark-all-seen");
    dispatch(markAllSeen());
  };

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handleScroll = () => {
      const isAtBottom =
        cardElement.scrollTop + cardElement.clientHeight >=
        cardElement.scrollHeight - 50;

      if (isAtBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    cardElement.addEventListener("scroll", handleScroll);

    return () => {
      cardElement.removeEventListener("scroll", handleScroll);
      markAllAsSeen();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "loading") {
    return (
      <div className="p-8 text-center">
        <Spinner />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="p-8 text-center text-red-500">
        Error fetching notifications.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <Card
        ref={cardRef}
        className="p-4 h-[700px] overflow-y-auto bg-gray-50 rounded-xl shadow-lg"
      >
        <ul className="flex flex-col gap-3">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((notif) => {
                const { label, icon } = getNotificationTypeProps(notif.type);
                return (
                  <li
                    key={notif._id}
                    className={cn(
                      `p-4 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md`,
                      !notif.seen
                        ? "bg-white border border-blue-200 shadow-sm"
                        : "bg-gray-100 border border-gray-200 text-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        <div
                          className={cn("p-2 rounded-full text-white", label)}
                        >
                          {icon}
                        </div>
                        {/* Notification Details */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {notif.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 whitespace-nowrap pt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </React.Fragment>
          ))}
        </ul>
        {isFetchingNextPage && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}
        {!hasNextPage && (
          <div className="text-center py-6 text-gray-500">
            You've reached the end of your notifications.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
