import apiClient from "../apiClient";

export interface Course {
  id: string;
  name: string;
  stream?: string;
  duration_years: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseDto {
  name: string;
  stream?: string;
  durationYears: number;
  description?: string;
}

export interface UpdateCourseDto {
  name?: string;
  stream?: string;
  durationYears?: number;
  description?: string;
}

export interface CourseListResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseResponse {
  message: string;
  data: Course;
}

export interface ImportResponse {
  message: string;
  data: {
    created: any[];
    updated: any[];
    failed: any[];
    total_processed: number;
    successful: number;
    failed_count: number;
  };
}

const coursesApi = {
  // Get all courses with pagination and filters
  getCourses: async (params?: {
    q?: string;
    stream?: string;
    durationYears?: number;
    page?: number;
    limit?: number;
  }): Promise<CourseListResponse> => {
    const response = await apiClient.get("/courses", { params });
    return response.data;
  },

  // Get courses by IDs
  getCoursesByIds: async (ids: string[]): Promise<Course[]> => {
    const response = await apiClient.get("/courses/by-ids", {
      params: { ids: ids.join(",") },
    });
    return response.data;
  },

  // Get single course by ID
  getCourse: async (id: string): Promise<CourseResponse> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Create new course
  createCourse: async (data: CreateCourseDto): Promise<CourseResponse> => {
    const response = await apiClient.post("/courses", data);
    return response.data;
  },

  // Update course
  updateCourse: async (
    id: string,
    data: UpdateCourseDto
  ): Promise<CourseResponse> => {
    const response = await apiClient.patch(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  // Import courses from file
  importCourses: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/courses/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Export courses to CSV
  exportCoursesCSV: async (): Promise<Blob> => {
    const response = await apiClient.get("/courses/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  // Export courses to Excel
  exportCoursesExcel: async (): Promise<Blob> => {
    const response = await apiClient.get("/courses/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },
};

export default coursesApi;
