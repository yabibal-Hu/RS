import { api, API_BASE_URL } from "@/hooks/api";

export const AdminService = {
  getOrders: async (page: number, pageSize: number, search?: string) => {
    const response = await api.get(`${API_BASE_URL}/admin/orders?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  },

  // approve order
  approveOrder: async (orderId: number, type: string, status: string) => {
    const response = await api.put(`${API_BASE_URL}/admin/order/approve`, {
      orderId,
      type,
      status,
    });
    return response.data;
  },

  //  get all users
  getAllUsers: async (params: {
    page: number;
    limit: number;
    search: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", String(params.page));
        queryParams.append("limit", String(params.limit));
        queryParams.append("search", params.search);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        const response = await api.get(
          `${API_BASE_URL}/admin/users?${queryParams.toString()}`
        );
        return response.data;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("User request failed");
      }
    }
  },
  // get user details
  getUserDetails: async (userId: string) => {
   try {
     const response = await api.get(
       `${API_BASE_URL}/admin/users/details/${userId}`
     );
     return response.data;
   } catch (error: any) {
     console.error("API Error:", error);

     if (error.response?.data?.error) {
       throw new Error(error.response.data.error);
     } else if (error.message) {
       throw new Error(error.message);
     } else {
       throw new Error("User request failed");
     }
   }
  },

  // get users info
  getUsersInfo: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/admin/users/info`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.response.data.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("User request failed");
      }
    }
  },

  // delete user
  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(
        `${API_BASE_URL}/admin/user/${userId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("User request failed");
      }
    }
  },
};