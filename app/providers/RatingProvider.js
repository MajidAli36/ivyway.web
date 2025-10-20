"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import ratingService from "../lib/api/ratingService";

// Initial state
const initialState = {
  reviews: [],
  unreviewedSessions: [],
  ratingStats: null,
  bonusStats: null,
  loading: false,
  error: null,
  pagination: null,
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_REVIEWS: "SET_REVIEWS",
  ADD_REVIEW: "ADD_REVIEW",
  UPDATE_REVIEW: "UPDATE_REVIEW",
  DELETE_REVIEW: "DELETE_REVIEW",
  SET_UNREVIEWED_SESSIONS: "SET_UNREVIEWED_SESSIONS",
  REMOVE_UNREVIEWED_SESSION: "REMOVE_UNREVIEWED_SESSION",
  SET_RATING_STATS: "SET_RATING_STATS",
  SET_BONUS_STATS: "SET_BONUS_STATS",
  SET_PAGINATION: "SET_PAGINATION",
  CLEAR_STATE: "CLEAR_STATE",
};

// Reducer function
function ratingReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_REVIEW:
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        error: null,
      };

    case actionTypes.UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
        error: null,
      };

    case actionTypes.DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
        error: null,
      };

    case actionTypes.SET_UNREVIEWED_SESSIONS:
      return {
        ...state,
        unreviewedSessions: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.REMOVE_UNREVIEWED_SESSION:
      return {
        ...state,
        unreviewedSessions: state.unreviewedSessions.filter(
          (session) => session.id !== action.payload
        ),
      };

    case actionTypes.SET_RATING_STATS:
      return {
        ...state,
        ratingStats: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_BONUS_STATS:
      return {
        ...state,
        bonusStats: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case actionTypes.CLEAR_STATE:
      return initialState;

    default:
      return state;
  }
}

// Create context
const RatingContext = createContext();

// Provider component
export function RatingProvider({ children }) {
  const [state, dispatch] = useReducer(ratingReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }, []);

  const clearState = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_STATE });
  }, []);

  // API action creators
  const fetchTutorReviews = useCallback(
    async (tutorId, options = {}) => {
      try {
        setLoading(true);
        const response = await ratingService.getTutorReviews(tutorId, options);
        dispatch({ type: actionTypes.SET_REVIEWS, payload: response.data });
        dispatch({
          type: actionTypes.SET_PAGINATION,
          payload: response.pagination,
        });
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const fetchRatingStats = useCallback(
    async (tutorId) => {
      try {
        setLoading(true);
        const response = await ratingService.getTutorRatingStats(tutorId);
        dispatch({
          type: actionTypes.SET_RATING_STATS,
          payload: response.data,
        });
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const fetchUnreviewedSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ratingService.getUnreviewedSessions();
      dispatch({
        type: actionTypes.SET_UNREVIEWED_SESSIONS,
        payload: response,
      });
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const fetchBonusStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ratingService.getTutorBonusStats();
      dispatch({ type: actionTypes.SET_BONUS_STATS, payload: response });
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const submitReview = useCallback(
    async (reviewData) => {
      try {
        const response = await ratingService.submitReview(reviewData);
        dispatch({ type: actionTypes.ADD_REVIEW, payload: response.data });
        dispatch({
          type: actionTypes.REMOVE_UNREVIEWED_SESSION,
          payload: reviewData.bookingId,
        });
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setError]
  );

  const editReview = useCallback(
    async (reviewId, reviewData) => {
      try {
        const response = await ratingService.editReview(reviewId, reviewData);
        dispatch({ type: actionTypes.UPDATE_REVIEW, payload: response.data });
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setError]
  );

  const deleteReview = useCallback(
    async (reviewId) => {
      try {
        await ratingService.deleteReview(reviewId);
        dispatch({ type: actionTypes.DELETE_REVIEW, payload: reviewId });
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setError]
  );

  const markReviewHelpful = useCallback(
    async (reviewId) => {
      try {
        const response = await ratingService.markReviewHelpful(reviewId);
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setError]
  );

  const reportReview = useCallback(
    async (reviewId, reason) => {
      try {
        const response = await ratingService.reportReview(reviewId, reason);
        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setError]
  );

  // Context value
  const contextValue = {
    // State
    ...state,

    // Basic actions
    setLoading,
    setError,
    clearState,

    // API actions
    fetchTutorReviews,
    fetchRatingStats,
    fetchUnreviewedSessions,
    fetchBonusStats,
    submitReview,
    editReview,
    deleteReview,
    markReviewHelpful,
    reportReview,

    // Utility functions
    canEditReview: ratingService.canEditReview,
    formatRating: ratingService.formatRating,
    getRatingColor: ratingService.getRatingColor,
    getRatingStatus: ratingService.getRatingStatus,
    validateReviewData: ratingService.validateReviewData,
  };

  return (
    <RatingContext.Provider value={contextValue}>
      {children}
    </RatingContext.Provider>
  );
}

// Custom hook to use rating context
export function useRating() {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
}

// Specific hooks for different use cases
export function useStudentRating() {
  const context = useRating();
  return {
    unreviewedSessions: context.unreviewedSessions,
    reviews: context.reviews,
    loading: context.loading,
    error: context.error,
    fetchUnreviewedSessions: context.fetchUnreviewedSessions,
    submitReview: context.submitReview,
    editReview: context.editReview,
    deleteReview: context.deleteReview,
    canEditReview: context.canEditReview,
  };
}

export function useTutorRating() {
  const context = useRating();
  return {
    reviews: context.reviews,
    ratingStats: context.ratingStats,
    bonusStats: context.bonusStats,
    loading: context.loading,
    error: context.error,
    fetchTutorReviews: context.fetchTutorReviews,
    fetchRatingStats: context.fetchRatingStats,
    fetchBonusStats: context.fetchBonusStats,
    formatRating: context.formatRating,
    getRatingColor: context.getRatingColor,
    getRatingStatus: context.getRatingStatus,
  };
}

export function usePublicRating() {
  const context = useRating();
  return {
    reviews: context.reviews,
    ratingStats: context.ratingStats,
    loading: context.loading,
    error: context.error,
    pagination: context.pagination,
    fetchTutorReviews: context.fetchTutorReviews,
    fetchRatingStats: context.fetchRatingStats,
    markReviewHelpful: context.markReviewHelpful,
    reportReview: context.reportReview,
  };
}
