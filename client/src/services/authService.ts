// import { api, API_BASE_URL } from "@/hooks";

import { api, API_BASE_URL } from "@/hooks/api";


export const AuthService = {
  // login service
  login: async (phone: string, password: string) => {
      try {
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
        phone,
        password,
      });
  
      // Now even 400 responses will come here instead of throwing errors
      return response.data;
    
 } catch (error: any) {
      console.error("API Error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login request failed");
      }
    }
  
  },

  //////////////////////////////////////////
  // register service
  register: async (phone: string, password: string, inviteCode: string, name: string) => {
    try {
      
      const response = await api.post(`${API_BASE_URL}/auth/register`, {
        phone,
        inviteCode,
        password,
        name
      });
      return response.data;
    } catch (error:any) {
       console.error("API Error:", error);

       if (error.response?.data?.error) {
         throw new Error(error.response.data.error);
       } else if (error.message) {
         throw new Error(error.message);
       } else {
         throw new Error("Login request failed");
       }
    }
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

  //////////////////////////////////////////
  // logout service
  // async logout() {
  //  const response = await api.post(`${API_BASE_URL}/auth/logout`, {
  //   token: localStorage.removeItem("token"),
  //  });
  //  return response.data;
  // }
};
