"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { authService } from "../lib/auth/authService";
import { API_CONFIG } from "../lib/api/config"; // Import API_CONFIG

// Create context
const SocketContext = createContext(null);

// Hook to use the socket context
export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Get JWT token from authService and connect
    const connectWithJwtToken = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          console.warn("No authenticated user found for socket connection");
          return;
        }

        // Get token from authService
        const token = authService.getToken();

        // Get base URL from API_CONFIG but remove the /api path suffix for socket connection
        const socketUrl = API_CONFIG.baseURL.replace(/\/api$/, "");

        // Initialize socket with authentication
        const socketInstance = io(socketUrl, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          auth: {
            token: token,
          },
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Connection event handlers
        socketInstance.on("connect", () => {
          console.log("Socket connected", socketInstance.id);
          setConnected(true);
        });

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected");
          setConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        socketInstance.on("error", (error) => {
          console.error("Socket error:", error);
          // If authentication error, you might want to redirect to login
          if (error === "Authentication error") {
            // Handle token expiration or auth error
            if (typeof window !== "undefined") {
              // Redirect to login or refresh token
              console.log("Authentication error - token might be expired");
            }
          }
        });

        // Notification event handlers
        socketInstance.on("notification:new", (data) => {
          console.log("New notification received:", data);
          // This will be handled by the NotificationProvider
        });

        socketInstance.on("notification:updated", (data) => {
          console.log("Notification updated:", data);
          // This will be handled by the NotificationProvider
        });

        socketInstance.on("notification:deleted", (data) => {
          console.log("Notification deleted:", data);
          // This will be handled by the NotificationProvider
        });

        // Set socket in state and ref
        setSocket(socketInstance);
        socketRef.current = socketInstance;
      } catch (error) {
        console.error("Error establishing socket connection:", error);
      }
    };

    connectWithJwtToken();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Value to be provided to consumers
  const value = {
    socket,
    connected,
    // Helper method to emit events
    emit: (event, data, callback) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data, callback);
      }
    },
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
