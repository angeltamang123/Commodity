"use client";
import { Button } from "@/components/ui/button";
import {
  addNotification,
  fetchNotifications,
} from "@/redux/reducerSlices/notificationSlice";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function NotificationSocket() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId, isLoggedIn } = useSelector((state) => state.persisted.user);

  const fetchUserRole = async () => {
    const { data } = await axios.get("/api/user/role");
    return data.role;
  };

  const { data: role, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: fetchUserRole,
    enabled: isLoggedIn,
  });

  const socketRef = useRef(null);

  const renderNotification = (notificationPayload) => (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3">
        <svg
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <div className="text-sm">
        <h4 className="font-bold text-gray-900">{notificationPayload.type}</h4>
        <p className="text-gray-700 mt-1">{notificationPayload.message}</p>
        <Button
          onClick={() => {
            router.push(role === "admin" ? "/admin/orders" : "/orders");
          }}
          className="mt-2 text-xs text-red-600 bg-white hover:bg-white border border-red-800 hover:text-red-800 transition-colors duration-200 block"
        >
          View Order Details &rarr;
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (userId) {
      socketRef.current = io(process.env.NEXT_PUBLIC_EXPRESS_API_URL);

      const socket = socketRef.current;

      socket.on("connect", () => {
        if (userId) {
          console.log(`Connected with ID: ${socket.id}`);
          socket.emit("register", { userId, role });
        }
      });

      socket.on("notification", (notificationPayload) => {
        dispatch(addNotification());

        toast(renderNotification(notificationPayload), {
          position: "top-center",
          icon: false,
          className: "bg-white border border-gray-200 rounded-lg shadow-lg",
          progressClassName: "bg-red-500",
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("notification");
      }
    };
  }, [dispatch, userId, role]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, userId]);

  return null;
}
