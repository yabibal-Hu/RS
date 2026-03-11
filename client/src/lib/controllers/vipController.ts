// import { prisma } from "@/lib/prisma"; // Adjust the import path as needed
// import { NextResponse } from "next/server";


// export const vipController = {
//   async create(req: Request) {
//     try {
//       const body = await req.json();


//       // ✅ Create VIP
//       const vip = await prisma.vip.create({ data: body });

//       return NextResponse.json(
//         { message: "VIP created successfully", vip },
//         { status: 201 }
//       );
//     } catch (err) {
//       console.error("VIP Create Error:", err);
//       return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
//   },
// };
