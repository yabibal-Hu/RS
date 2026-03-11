// import { NextResponse } from "next/server";
// import { profileService } from "@/lib/services/profileService";

// export const profileController = {
//   async getProfile(userId: string) {
//     try {
//       const profile = await profileService.getUserProfile(userId);
//       if (!profile) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }
//       return NextResponse.json({ success: true, data: profile });
//     } catch (error) {
//       console.error("Get Profile Error:", error);
//       return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
//   },
// };
