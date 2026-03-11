// import { NextResponse } from "next/server";
// import { taskService } from "../services/taskService";

// export const taskController = {
//   async getTaskInfo(userId: string, timeIsUp:boolean) {
//     try {
//       const profile = await taskService.getUserTaskInfo(userId,timeIsUp);
//       if (!profile) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }
//       return NextResponse.json({ success: true, data: profile });
//     } catch (error) {
//       console.error("Get Profile Error:", error);
//       return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
//   },

//   async makeTask(userId: string, body: { taskInfoId: string }) {
//     try {
//       const profile = await taskService.makeTask(userId, body);
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

