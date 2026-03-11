// lib/auth-client.ts
export const authClient = {
  // Set token in localStorage
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("welcomeCardShown", "true");
    // Dispatch event for other tabs/components
    window.dispatchEvent(new Event("authChange"));
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("vipLevel");
    localStorage.removeItem("selectedCurrency");
    window.dispatchEvent(new Event("authChange"));
  },

  // Check authentication
  isAuthenticated: (): boolean => {
    // check the token is authorized and not expired
    const token = authClient.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      return exp > Date.now();
    } catch {
      return false;
    }
  },

  // Get user role from token
  getUserRole: (): string | null => {
    const token = authClient.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  },

  // Get user data from token
  getUserData: () => {
    const token = authClient.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // if (payload && payload.role === "ADMIN") {
      //   // router.replace("/admin/orders");
      //   window.location.href = "/admin/orders";
      // } else if (payload && payload.role === "USER") {
      //   // router.replace("/");
      //   window.location.href = "/";
      // } else {
      //   // router.push("/login");
      //   window.location.href = "/login";
      // }

      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };
    } catch {
      return null;
    }
  },

  // Logout user
  logout: () => {
    authClient.removeToken();
    window.location.href = "/login";
  },
};
