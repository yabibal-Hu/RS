// "use client";

// import { useEffect, useState } from "react";
// import Player from "lottie-react";
// import loadingAnimation from "../public/lottie/loading.json";
// import giftAnimation from "../public/lottie/gift.json";

// export default function TaskUnlockPage() {
//   const [showGift, setShowGift] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowGift(true);
//     }, 5000); // 5 seconds

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       {!showGift ? (
//         <Player
//           autoplay
//           loop
//           animationData={loadingAnimation}
//           className="w-64 h-64"
//         />
//       ) : (
//         <Player
//           autoplay
//           loop={false}
//           animationData={giftAnimation}
//           className="w-64 h-64"
//         />
//       )}
//     </div>
//   );
// }
