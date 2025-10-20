"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import ivywayAIService from "../lib/api/ivywayAIService";

const IvyWayAIContext = createContext();

const initialState = {
  connectionStatus: "checking",
  conversations: [],
  documents: [],
  analytics: null,
  loading: false,
  error: null,
};

const ivywayAIReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload };
    case "ADD_DOCUMENT":
      return { ...state, documents: [action.payload, ...state.documents] };
    case "SET_ANALYTICS":
      return { ...state, analytics: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const IvyWayAIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ivywayAIReducer, initialState);

  const checkConnection = async (showToast = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.testConnection();

      if (response.status === "connected" || response.success) {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: "connected" });
        if (showToast) {
          toast.success("Connected to IvyWay AI!");
        }
      } else {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: "partial" });
        if (showToast) {
          toast.warning("Partial connection to IvyWay AI");
        }
      }
    } catch (error) {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "disconnected" });
      dispatch({ type: "SET_ERROR", payload: error.message });
      // Only show error toast if explicitly requested
      if (showToast) {
        toast.error("Failed to connect to IvyWay AI");
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const sendMessage = async (message, userId, context = "general") => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.sendChatMessage(
        message,
        userId,
        context
      );

      if (response.success) {
        const conversation = {
          id: Date.now(),
          message: message,
          response: response.response || response.message,
          timestamp: response.timestamp || new Date().toISOString(),
          context: response.context_used,
        };

        dispatch({ type: "ADD_CONVERSATION", payload: conversation });
        return response;
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const uploadDocument = async (file, userId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.uploadDocument(file, userId);

      if (response.success) {
        const document = {
          id: response.document_id || Date.now(),
          filename: response.filename || file.name,
          size: response.size || file.size,
          status: response.processing_status || "processing",
          uploadedAt: response.timestamp || new Date().toISOString(),
        };

        dispatch({ type: "ADD_DOCUMENT", payload: document });
        return response;
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadConversations = async (userId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.getConversationHistory(userId);

      if (response.success) {
        dispatch({
          type: "SET_CONVERSATIONS",
          payload: response.conversations || [],
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadDocuments = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.getDocuments();

      if (response.success) {
        dispatch({ type: "SET_DOCUMENTS", payload: response.documents || [] });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadAnalytics = async (period = "7d") => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ivywayAIService.getAnalytics(period);

      if (response.success) {
        dispatch({ type: "SET_ANALYTICS", payload: response.analytics || {} });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  useEffect(() => {
    checkConnection(false); // Silent connection check on mount
  }, []);

  const value = {
    ...state,
    checkConnection,
    sendMessage,
    uploadDocument,
    loadConversations,
    loadDocuments,
    loadAnalytics,
    clearError,
  };

  return (
    <IvyWayAIContext.Provider value={value}>
      {children}
    </IvyWayAIContext.Provider>
  );
};

export const useIvyWayAI = () => {
  const context = useContext(IvyWayAIContext);
  if (!context) {
    throw new Error("useIvyWayAI must be used within an IvyWayAIProvider");
  }
  return context;
};
