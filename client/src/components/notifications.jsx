"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { markAllSeen } from "@/redux/reducerSlices/notificationSlice";

const fetchNotifications = async ({ pageParam = 0 }) => {
  const res = await api.get(`/notifications?limit=20&skip=${pageParam}`);
  return res.data;
};

const Notifications = () => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
      getNextPageParam: (lastPage, allPages) => {
        // Return the 'skip' value for the next page
        if (lastPage.length === 0) {
          return undefined; // No more pages
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

  // Handle loading and error states
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
        className="overflow-y-auto h-[700px] flex flex-col justify-between p-4"
      >
        <ul className="flex flex-col gap-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((notif) => (
                <li
                  key={notif._id}
                  className={cn(
                    `p-3 bg-gray-50 rounded-md`,
                    !notif.seen && "bg-blue-200"
                  )}
                >
                  <div className="w-full flex justify-between">
                    <div>
                      <p className="font-semibold">{notif.type}</p>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
        {isFetchingNextPage && (
          <div className="text-center py-4">
            <Spinner />
          </div>
        )}
        {!hasNextPage && (
          <div className="text-center py-4 text-gray-500">
            You've reached the end of your notifications.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
