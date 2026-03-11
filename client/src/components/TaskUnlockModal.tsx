// // components/TaskUnlockModal.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Player from "lottie-react";
// import loadingAnimation from "../public/lottie/loading.json";
// import giftAnimation from "../public/lottie/gift.json";
// import { useRouter } from "next/navigation";

// export default function TaskUnlockModal({ onClose }: { onClose: () => void }) {
//   const [showGift, setShowGift] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowGift(true);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-gray-700/90 flex items-center justify-center z-100 min-h-screen">
//       {!showGift ? (
//         <Player
//           autoplay
//           loop
//           animationData={loadingAnimation}
//           className="w-72 h-72"
//         />
//       ) : (<div>

//         <Player
//           autoplay
//           loop={false}
//           animationData={giftAnimation}
//           className="w-72 h-72"
//           onComplete={ () => {
//            // Optional: Close modal automatically
//            router.push("/task");
//             setTimeout(() => {
            
//             onClose();
//            });
//           }}
//           />
//           <p className="text-gray-100 text-2xl font-semibold mt-4 font-poppins">Task Unlocked</p>
//           </div>
//       )
//       }
//     </div>
//   );
// }
