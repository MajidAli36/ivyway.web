import apiClient from "./client";

class ProvidersService {
  // Get Available Providers (Tutors/Counselors)
  async getProviders(filters = {}) {
    try {
      // Map UI filters to API query params. Keep unknown keys to support
      // evolving backend without blocking the UI.
      const {
        // UI fields
        role,
        subjects,
        specializations,
        search,
        availability,
        page,
        limit,
        // Backward-compat fields
        type: typeDirect,
        subject,
        gradeLevel,
        ...rest
      } = filters;

      const params = {
        // API expects `type` for role filtering; default to "all"
        type: (role && role !== "all" ? role : undefined) || typeDirect || "all",
        // Keep legacy single-subject fields while supporting arrays
        subject,
        gradeLevel,
        // Newer rich filters
        subjects: Array.isArray(subjects) && subjects.length ? subjects.join(",") : undefined,
        specializations:
          Array.isArray(specializations) && specializations.length
            ? specializations.join(",")
            : undefined,
        search: search || undefined,
        availability:
          typeof availability === "boolean"
            ? availability
            : availability === "available"
            ? true
            : availability === "unavailable"
            ? false
            : undefined,
        page,
        limit,
        // Pass through any remaining simple fields
        ...rest,
      };

      const response = await apiClient.get("/teacher/providers", params);
      return response;
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }
  }

  // Get Tutors Only
  async getTutors(filters = {}) {
    return this.getProviders({ ...filters, type: "tutor" });
  }

  // Get Counselors Only
  async getCounselors(filters = {}) {
    return this.getProviders({ ...filters, type: "counselor" });
  }
}

export const providersService = new ProvidersService();
export default providersService;
