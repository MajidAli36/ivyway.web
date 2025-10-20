import apiClient from "./client";

class ProgressReportsService {
  // Create Progress Report
  async createReport(reportData) {
    try {
      const response = await apiClient.post("/progress-reports", reportData);
      return response;
    } catch (error) {
      console.error("Error creating progress report:", error);
      throw error;
    }
  }

  // Get Progress Reports with pagination and filters
  async getReports(filters = {}) {
    try {
      const { reportType, status, search, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (reportType) params.reportType = reportType;
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await apiClient.get("/progress-reports", params);
      return response;
    } catch (error) {
      console.error("Error fetching progress reports:", error);
      throw error;
    }
  }

  // Get Single Progress Report
  async getReport(id) {
    try {
      const response = await apiClient.get(`/progress-reports/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching progress report:", error);
      throw error;
    }
  }

  // Update Progress Report
  async updateReport(id, reportData) {
    try {
      const response = await apiClient.put(
        `/progress-reports/${id}`,
        reportData
      );
      return response;
    } catch (error) {
      console.error("Error updating progress report:", error);
      throw error;
    }
  }

  // Submit Progress Report
  async submitReport(id) {
    try {
      const response = await apiClient.patch(`/progress-reports/${id}/submit`);
      return response;
    } catch (error) {
      console.error("Error submitting progress report:", error);
      throw error;
    }
  }

  // Delete Progress Report
  async deleteReport(id) {
    try {
      const response = await apiClient.delete(`/progress-reports/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting progress report:", error);
      throw error;
    }
  }

  // Get Progress Report Statistics
  async getStatistics() {
    try {
      const response = await apiClient.get("/progress-reports/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching progress report statistics:", error);
      throw error;
    }
  }
}

export const progressReportsService = new ProgressReportsService();
export default progressReportsService;
