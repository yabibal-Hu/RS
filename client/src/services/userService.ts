// import { api, API_BASE_URL } from "@/hooks";

import { api, API_BASE_URL } from "@/hooks/api";
import { authClient } from "@/lib/auth-client";

export const UserService = {
  // login service
  info: async () => {
    const token = authClient.getToken(); // Get fresh token each time

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get(`${API_BASE_URL}/user/info`);

    return response.data;
  },

  //////////////////////////////////////////
  // register service
  register: async (phone: string, password: string, inviteCode: string) => {
    const response = await api.post(`${API_BASE_URL}/auth/register`, {
      phone,
      inviteCode,
      password,
    });
    return response.data;
  },
  //////////////////////////////////////////
  // change password service
  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put(`${API_BASE_URL}/auth/password`, {
      currentPassword,
      newPassword,
      token: localStorage.getItem("token"),
    });
    return response.data;
  },

  // deposit balance
  async deposit(formData: FormData) {
    const token = authClient.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await api.post(
        `${API_BASE_URL}/user/deposit/balance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for FormData
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Deposit request failed");
      }
    }
  },

  // get deposit orders
  async getDepositOrders() {
    try {
      const response = await api.get(`${API_BASE_URL}/user/deposit/orders`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Deposit request failed");
      }
    }
  },

  // get task
  async getTasks(timeIsUp: boolean) {
    try {
      const response = await api.get(
        `${API_BASE_URL}/user/task/info?timeIsUp=${timeIsUp}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Task request failed");
      }
    }
  },

  // make task
  async makeTask(taskInfoId: number) {
    try {
      const response = await api.post(`${API_BASE_URL}/user/task/make`, {
        taskInfoId,
      });
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Task request failed");
      }
    }
  },

  // get user balance
  async getBalance() {
    try {
      const response = await api.get(`${API_BASE_URL}/user/balance`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Balance request failed");
      }
    }
  },

  // withdraw balance
  async withdraw(payload: any) {
    try {
      const { amount, method, accountOwner, useAccount, phone, type } = payload;
      const response = await api.post(`${API_BASE_URL}/user/withdraw/balance`, {
        amount,
        method,
        accountOwner,
        useAccount,
        phone,
        type,
      });
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Withdraw request failed");
      }
    }
  },

  // get withdraw orders
  async getWithdrawOrders() {
    try {
      const response = await api.get(`${API_BASE_URL}/user/withdraw/orders`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Withdraw request failed");
      }
    }
  },

  // get referral
  async getReferral() {
    try {
      const response = await api.get(`${API_BASE_URL}/user/referral/info`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Referral request failed");
      }
    }
  },
  // get referral network
  async getReferralNetwork() {
    try {
      const response = await api.get(`${API_BASE_URL}/user/referral/network`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Referral request failed");
      }
    }
  },
};
