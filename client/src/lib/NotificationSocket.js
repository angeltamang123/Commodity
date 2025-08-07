"use client";
import {
  addNotification,
  fetchNotifications,
} from "@/redux/reducerSlices/notificationSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function NotificationSocket() {
  const dispatch = useDispatch();
  const { userId, role } = useSelector((state) => state.persisted.user);

  const socketRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);

      const socket = socketRef.current;

      socket.on("connect", () => {
        if (userId) {
          console.log(`Connected with ID: ${socket.id}`);
          socket.emit("register", { userId, role });
        }
      });

      socket.on("notification", (notificationPayload) => {
        dispatch(addNotification());
        console.log("Notification");
        toast.info(
          <div>
            <h4 className="font-bold">{notificationPayload.type}</h4>
            <p>{notificationPayload.message}</p>
          </div>,
          {
            position: "top-center",
          }
        );
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
