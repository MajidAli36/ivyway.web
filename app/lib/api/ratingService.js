import apiClient from "./client";

/**
 * Rating Service - Handles all rating and review related API calls
 */
class RatingService {
  constructor() {
    this.baseURL = "/ratings";
  }

  // ===============================
  // PUBLIC ENDPOINTS (No Auth Required)
  // ===============================

  /**
   * Get all reviews for a specific tutor (public profile page)
   */
  async getTutorReviews(tutorId, options = {}) {
    const { page = 1, limit = 10 } = options;
    try {
      const response = await apiClient.get(
        `${this.baseURL}/tutors/${tutorId}/reviews`,
        {
          params: { page, limit },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching tutor reviews:", error);
      throw error;
    }
  }

  /**
   * Get rating statistics for a tutor (public profile page)
   */
  async getTutorRatingStats(tutorId) {
    try {
      const response = await apiClient.get(
        `${this.baseURL}/tutors/${tutorId}/stats`
      );
      return response;
    } catch (error) {
      console.error("Error fetching tutor rating stats:", error);
      throw error;
    }
  }

  // ===============================
  // STUDENT ENDPOINTS
  // ===============================

  /**
   * Get student's unreviewed sessions
   */
  async getUnreviewedSessions() {
    try {
      const response = await apiClient.get(
        `${this.baseURL}/student/unreviewed`
      );
      return response;
    } catch (error) {
      console.error("Error fetching unreviewed sessions:", error);
      throw error;
    }
  }

  /**
   * Submit a new review
   */
  async submitReview(reviewData) {
    try {
      const response = await apiClient.post(
        `${this.baseURL}/reviews`,
        reviewData
      );
      return response;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  }

  /**
   * Get student's review history
   */
  async getStudentReviews(options = {}) {
    const { page = 1, limit = 10 } = options;
    try {
      const response = await apiClient.get(`${this.baseURL}/student/reviews`, {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      console.error("Error fetching student reviews:", error);
      throw error;
    }
  }

  /**
   * Edit an existing review (within 24 hours)
   */
  async editReview(reviewId, reviewData) {
    try {
      const response = await apiClient.put(
        `${this.baseURL}/reviews/${reviewId}`,
        reviewData
      );
      return response;
    } catch (error) {
      console.error("Error editing review:", error);
      throw error;
    }
  }

  /**
   * Delete a review (within 24 hours)
   */
  async deleteReview(reviewId) {
    try {
      const response = await apiClient.delete(
        `${this.baseURL}/reviews/${reviewId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  // ===============================
  // TUTOR ENDPOINTS
  // ===============================

  /**
   * Get tutor's bonus statistics
   */
  async getTutorBonusStats() {
    try {
      const response = await apiClient.get(`/ratings/tutor/bonus-stats`);

      // Check if response has meaningful data
      if (
        !response ||
        !response.data ||
        Object.keys(response.data).length === 0 ||
        (response.data && typeof response.data === 'object' && Object.keys(response.data).length === 0) ||
        (response.data && typeof response.data === 'object' && JSON.stringify(response.data) === '{}')
      ) {
        // This is a new tutor with no bonus stats - throw a specific error
        const noDataError = new Error("No bonus data available for new tutor");
        noDataError.status = 404;
        noDataError.isNewTutor = true;
        throw noDataError;
      }

      return response;
    } catch (error) {
      // Don't log errors for new tutors (expected behavior)
      if (error.isNewTutor) {
        throw error;
      }

      // Don't log empty error objects or 404 errors (likely new tutor)
      if (error && Object.keys(error).length > 0 && error.status !== 404) {
        console.error("Error fetching tutor bonus stats:", error);
      }
      throw error;
    }
  }

  /**
   * Get tutor's own reviews and ratings
   */
  async getTutorOwnReviews(options = {}) {
    const { page = 1, limit = 10, rating, startDate, endDate } = options;
    try {
      const response = await apiClient.get(`${this.baseURL}/tutor/reviews`, {
        params: { page, limit, rating, startDate, endDate },
      });
      return response;
    } catch (error) {
      console.error("Error fetching tutor own reviews:", error);
      throw error;
    }
  }

  // ===============================
  // GENERAL AUTHENTICATED ENDPOINTS
  // ===============================

  /**
   * Mark a review as helpful
   */
  async markReviewHelpful(reviewId) {
    try {
      const response = await apiClient.post(
        `${this.baseURL}/reviews/${reviewId}/helpful`
      );
      return response;
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      throw error;
    }
  }

  /**
   * Report a review as inappropriate
   */
  async reportReview(reviewId, reason) {
    try {
      const response = await apiClient.post(
        `${this.baseURL}/reviews/${reviewId}/report`,
        { reason }
      );
      return response;
    } catch (error) {
      console.error("Error reporting review:", error);
      throw error;
    }
  }

  // ===============================
  // UTILITY METHODS
  // ===============================

  /**
   * Check if a review can be edited (within 24 hours)
   */
  canEditReview(reviewCreatedAt) {
    const createdAt = new Date(reviewCreatedAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }

  /**
   * Format rating for display
   */
  formatRating(rating) {
    return Number(rating).toFixed(1);
  }

  /**
   * Get rating color based on value
   */
  getRatingColor(rating) {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.0) return "text-orange-600";
    return "text-red-600";
  }

  /**
   * Get rating status text
   */
  getRatingStatus(rating) {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Average";
    return "Needs Improvement";
  }

  /**
   * Validate review data before submission
   */
  validateReviewData(reviewData) {
    const errors = {};

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.rating = "Rating must be between 1 and 5";
    }

    if (reviewData.comment && reviewData.comment.length > 1000) {
      errors.comment = "Comment must be less than 1000 characters";
    }

    if (!reviewData.bookingId) {
      errors.bookingId = "Booking ID is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Create singleton instance
const ratingService = new RatingService();

export default ratingService;
