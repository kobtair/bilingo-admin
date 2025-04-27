const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API error for ${endpoint}:`, error)
    throw error
  }
}

// Users API
export const usersAPI = {
  getAll: () => fetchAPI<any[]>("/users"),
  getById: (id: string) => fetchAPI<any>(`/users/${id}`),
  create: (data: any) =>
    fetchAPI<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchAPI<any>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/users/${id}`, {
      method: "DELETE",
    }),
}

// Admins API
export const adminsAPI = {
  getAll: () => fetchAPI<any[]>("/admins"),
  getById: (id: string) => fetchAPI<any>(`/admins/${id}`),
  create: (data: any) =>
    fetchAPI<any>("/admins", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchAPI<any>(`/admins/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/admins/${id}`, {
      method: "DELETE",
    }),
}

// Courses API
export const coursesAPI = {
  getAll: () => fetchAPI<any[]>("/courses"),
  getById: (id: string) => fetchAPI<any>(`/courses/${id}`),
  create: (data: any) =>
    fetchAPI<any>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchAPI<any>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
}

// Chapters API
export const chaptersAPI = {
  getAllByCourse: (courseId: string) => fetchAPI<any[]>(`/courses/${courseId}/chapters`),
  getById: (id: string) => fetchAPI<any>(`/chapters/${id}`),
  create: (courseId: string, data: any) =>
    fetchAPI<any>(`/courses/${courseId}/chapters`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchAPI<any>(`/chapters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/chapters/${id}`, {
      method: "DELETE",
    }),
  reorder: (courseId: string, chapterIds: string[]) =>
    fetchAPI<void>(`/courses/${courseId}/chapters/reorder`, {
      method: "POST",
      body: JSON.stringify({ chapterIds }),
    }),
}

// Audio Files API
export const audioFilesAPI = {
  getAll: () => fetchAPI<any[]>("/audio"),
  getById: (id: string) => fetchAPI<any>(`/audio/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/audio`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message || `API error: ${response.status}`)
        })
      }
      return response.json()
    })
  },
  delete: (id: string) =>
    fetchAPI<void>(`/audio/${id}`, {
      method: "DELETE",
    }),
}

// Dashboard Stats API
export const statsAPI = {
  getDashboardStats: () => fetchAPI<any>("/stats/dashboard"),
}

