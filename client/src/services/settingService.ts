// import { api, API_BASE_URL } from "@/hooks";

import { api, API_BASE_URL } from "@/hooks/api";


export const SettingService = {
  // vip
  allVips: async () => {
    const response = await api.get(`${API_BASE_URL}/system/all`);

    // Now even 400 responses will come here instead of throwing errors
    return response.data;
  },

  // get banks
  banks: async (type: String) => {
    const response = await api.get(
      `${API_BASE_URL}/system/banks/?type=${type}`,
    );

    // Now even 400 responses will come here instead of throwing errors
    return response.data;
  },

  // get task info
  taskInfo: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/system/taskInfo`);

      // Now even 400 responses will come here instead of throwing errors
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Task request failed");
      }
    }
  },
  // Bank operations
  getBanks: async () => {
    const response = await api.get("/system/banks");
    return response.data;
  },

  createBank: async (data: FormData) => {
    const response = await api.post("/system/banks", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBank: async (id: number, data: FormData) => {
    const response = await api.put(`/system/banks/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBank: async (id: number) => {
    const response = await api.delete(`/system/banks/${id}`);
    return response.data;
  },

  // Settings operations
  getSettings: async () => {
    const response = await api.get("/system/settings");
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await api.post("/system/settings", data);
    return response.data;
  },

  // TaskInfo operations
  getTaskInfo: async () => {
    const response = await api.get("/system/task-info");
    return response.data;
  },

  createTaskInfo: async (data: FormData) => {
    const response = await api.post("/system/task-info", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateTaskInfo: async (id: number, data: FormData) => {
    const response = await api.put(`/system/task-info/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteTaskInfo: async (id: number) => {
    try {
      const response = await api.delete(`/system/task-info/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Delete task info request failed");
      }
    }
  },

  // VIP operations
  getVips: async () => {
    const response = await api.get("/system/vips");
    return response.data;
  },

  createVip: async (data: FormData) => {
    const response = await api.post("/system/vips", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateVip: async (id: number, data: FormData) => {
    const response = await api.put(`/system/vips/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteVip: async (id: number) => {
    const response = await api.delete(`/system/vips/${id}`);
    return response.data;
  },
};