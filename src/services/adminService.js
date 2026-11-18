import api from "./api";

export const getDashboardStats = async() => {
    const response = await api.get(
        "/admin/dashboard"
    );
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get(
        "/admin/users"
    );
    return response.data;
};

export const updateUserStatus = async (id) => {
    const response = await api.patch(
        `/admin/users/${id}/status`
    );
    return response.data;
};

export const getAllBookings = async () => {
    const response = await api.get("/admin/bookings");

    return response.data;
};

export const getAllPayments = async () => {
    try {
        const response = await api.get("/admin/payments");

        return response.data;
    } catch (error) {
        console.error(
            "Get All Payments Error:",
            error
        );
        throw error;
    }
};


// Instructors
export const createInstructor = async (data) => {
    const response = await api.post(
        "/admin/instructors",
        data
    );

    return response.data;
};

export const getAllInstructors = async () => {
    const response = await api.get(
        "/admin/instructors"
    );
    return response.data;
};

export const updateInstructor = async (id, data) => {
    const response = await api.put(
        `/admin/instructors/${id}`,
        data
    );

    return response.data;
};

export const deleteInstructor = async (id) => {
    const response = await api.delete(
        `/admin/instructors/${id}`
    );

    return response.data;
};

export const toggleInstructorStatus = async (id) => {
    const response = await api.patch(
        `/admin/instructors/${id}/status`
    );

    return response.data;
};


// classes 
export const getAllClasses = async () => {
    const response = await api.get(
        "/admin/classes"
    );
    return response.data;
};

export const updateClass = async (id, data) => {
    const response = await api.put(
        `/classes/${id}`,
        data,
        { withCredentials: true }
    );

    return response.data;
};

export const deleteClass = async (id) => {
    const response = await api.delete(
        `/classes/${id}`
    );

    return response.data;
};

// export const createClassSession = async (data) => {
//     const response = await api.post(
//         "/class-sessions/create",
//         data,
//         { withCredentials: true }
//     );

//     return response.data;
// };

export const getAllClassSessions = async () => {
    const response = await api.get("/class-sessions", {
        withCredentials: true,
    });

    return response.data;
};

export const createClassSession = async (data) => {
    const response = await api.post(
        "/class-sessions/create",
        data,
        { withCredentials: true }
    );

    return response.data;
};

// Create Class
export const createClass = async (formData) => {
  const response = await api.post("/classes", formData, {
    withCredentials: true,
  });

  return response.data;
};

// Get all blogs
export const getAllBlogs = async () => {
  const response = await api.get("/admin/blogs");
  return response.data;
};

// Create blog
export const createBlog = async (formData) => {
  const response = await api.post("/blogs", formData, {
    withCredentials: true,
  });

  return response.data;
};