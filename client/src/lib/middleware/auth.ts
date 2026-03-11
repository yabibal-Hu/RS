// import { NextRequest } from "next/server";
// import { verifyToken } from "@/lib/jwt";
// import { authClient } from "../auth-client";

// export async function authenticate(req: NextRequest) {
//   try {
//     authClient.getUserData();
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return null;
//     }
//     console.log("isAuthenticated: ", authClient.isAuthenticated());
//     const token = authHeader.split(" ")[1];
//     return verifyToken(token); // returns { id, phone }
//   } catch {
//     return null;
//   }
// }
