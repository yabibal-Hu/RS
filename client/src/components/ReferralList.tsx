import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import { motion } from "framer-motion";
import {
  Crown,
  Users,
  ChevronRight,
  UserPlus,
  // Award,
  // Sparkles,
} from "lucide-react";

type ReferralStats = {
  level1?: number;
  level2?: number;
  level3?: number;
  totalReferrals?: number;
};

type CustomTreeNodeDatum = {
  name: string;
  value?: number;
  children?: CustomTreeNodeDatum[];
  attributes?: {
    level?: string;
    count?: number;
  };
};

interface ReferralNetworkProps {
  data: ReferralStats;
}

// Mobile-optimized Custom Node
const CustomNode = ({ nodeDatum }: { nodeDatum: CustomTreeNodeDatum }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // const getNodeColor = (name: string) => {
  //   if (name === "You") return "from-amber-400 to-orange-400";
  //   if (name.includes("Level 1")) return "from-amber-400 to-orange-400";
  //   if (name.includes("Level 2")) return "from-amber-300 to-orange-300";
  //   if (name.includes("Level 3")) return "from-amber-200 to-orange-200";
  //   return "from-amber-400 to-orange-400";
  // };

  const getNodeSize = (name: string) => {
    if (isMobile) {
      if (name === "You") return 28;
      if (name.includes("Level 1")) return 24;
      if (name.includes("Level 2")) return 22;
      return 20;
    } else {
      if (name === "You") return 40;
      if (name.includes("Level 1")) return 35;
      if (name.includes("Level 2")) return 30;
      return 25;
    }
  };

  const size = getNodeSize(nodeDatum.name);
  // const gradient = getNodeColor(nodeDatum.name);
  const value = nodeDatum.value || 0;

  return (
    <g>
      {/* Glow Effect - Smaller on mobile */}
      <circle
        r={size + (isMobile ? 3 : 5)}
        fill={`url(#grad-${nodeDatum.name.replace(/\s/g, "")})`}
        opacity="0.2"
      />

      {/* Main Circle */}
      <circle
        r={size}
        className="transition-all duration-300"
        style={{
          fill: `url(#grad-${nodeDatum.name.replace(/\s/g, "")})`,
          filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))",
        }}
      />

      {/* Icon based on node type - Scaled for mobile */}
      {nodeDatum.name === "You" ? (
        <Crown
          x={-size / 2.5}
          y={-size / 2.5}
          className={`${isMobile ? "w-4 h-4" : "w-6 h-6"} text-white`}
        />
      ) : (
        <UserPlus
          x={-size / 3}
          y={-size / 3}
          className={`${isMobile ? "w-3 h-3" : "w-5 h-5"} text-white`}
        />
      )}

      {/* Node Label - Hidden on mobile to save space */}
      {!isMobile && (
        <text
          x={size + 15}
          y={5}
          className="text-sm font-serif fill-amber-800"
          style={{ fontSize: "12px" }}
        >
          {nodeDatum.name}
        </text>
      )}

      {/* Value Badge - Compact on mobile */}
      {value > 0 && (
        <g>
          <rect
            x={size + (isMobile ? 5 : 15)}
            y={isMobile ? -15 : -20}
            width={isMobile ? 25 : 35}
            height={isMobile ? 16 : 18}
            rx={isMobile ? 8 : 9}
            className="fill-amber-100"
          />
          <text
            x={size + (isMobile ? 12 : 25)}
            y={isMobile ? -4 : -8}
            className={`${isMobile ? "text-[9px]" : "text-xs"} font-bold fill-amber-700`}
          >
            {value}
          </text>
        </g>
      )}
    </g>
  );
};

export const ReferralNetwork = ({ data }: ReferralNetworkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const [translate, setTranslate] = useState({ x: 150, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(0.8);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setZoom(window.innerWidth < 768 ? 0.6 : 0.8);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // setDimensions({ width, height });

        // Adjust translate based on screen size
        if (isMobile) {
          setTranslate({ x: width / 2, y: 40 });
        } else {
          setTranslate({ x: width / 2, y: 80 });
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile]);

  // Transform data into tree format with proper structure
  const treeData: CustomTreeNodeDatum = {
    name: "You",
    attributes: { level: "root", count: 1 },
    children: data?.level1
      ? [
          {
            name: "Level 1",
            value: data.level1,
            attributes: { level: "1", count: data.level1 },
            children: data?.level2
              ? [
                  {
                    name: "Level 2",
                    value: data.level2,
                    attributes: { level: "2", count: data.level2 },
                    children: data?.level3
                      ? [
                          {
                            name: "Level 3",
                            value: data.level3,
                            attributes: { level: "3", count: data.level3 },
                          },
                        ]
                      : [],
                  },
                ]
              : [],
          },
        ]
      : [],
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4 relative overflow-hidden"
    >
      {/* Decorative Elements - Smaller on mobile */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-2xl -z-10"></div>

      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif text-amber-800">
              Referral Network
            </h2>
            <p className="text-xs sm:text-sm text-amber-500">
              Your referral tree visualization
            </p>
          </div>
        </div>

        {/* Stats Summary - Horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
          <div className="px-2 py-1 bg-amber-100 rounded-full border border-amber-200 whitespace-nowrap">
            <span className="text-[10px] sm:text-xs text-amber-700">
              Total: {data?.totalReferrals || 0}
            </span>
          </div>
          <div className="px-2 py-1 bg-amber-100 rounded-full border border-amber-200 whitespace-nowrap">
            <span className="text-[10px] sm:text-xs text-amber-700">
              Levels:{" "}
              {[
                data?.level1 && "L1",
                data?.level2 && "L2",
                data?.level3 && "L3",
              ]
                .filter(Boolean)
                .join(" • ")}
            </span>
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div
        className="w-full border border-amber-200 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50"
        style={{ height: isMobile ? 300 : 400 }}
      >
        {!data?.level1 && !data?.level2 && !data?.level3 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-base sm:text-lg font-serif text-amber-800 mb-1">
              No Referrals Yet
            </h3>
            <p className="text-amber-500 text-xs sm:text-sm mb-3 max-w-xs">
              Start building your network by inviting friends.
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              Invite Friends
            </button>
          </div>
        ) : (
          <Tree
            data={treeData}
            orientation="vertical"
            pathFunc="step"
            translate={translate}
            nodeSize={isMobile ? { x: 100, y: 70 } : { x: 150, y: 100 }}
            separation={{ siblings: 1.2, nonSiblings: 1.5 }}
            zoomable={true}
            zoom={zoom}
            renderCustomNodeElement={(props) => (
              <CustomNode nodeDatum={props.nodeDatum} />
            )}
            pathClassFunc={() => "stroke-amber-300 stroke-1"}
          />
        )}
      </div>

      {/* Legend - Mobile Optimized */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t border-amber-200">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-400"></div>
          <span className="text-[10px] sm:text-xs text-amber-600">You</span>
        </div>
        <ChevronRight className="w-3 h-3 text-amber-300" />
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-orange-300"></div>
          <span className="text-[10px] sm:text-xs text-amber-600">Level 1</span>
        </div>
        <ChevronRight className="w-3 h-3 text-amber-300" />
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-orange-200"></div>
          <span className="text-[10px] sm:text-xs text-amber-600">
            Level 2-3
          </span>
        </div>
      </div>

      {/* Gradient Definitions */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="grad-You" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="grad-Level1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="grad-Level2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="grad-Level3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>
        </defs>
      </svg>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};
