import { Button } from "@/components/ui/button";

const levels = [
  {
    level: "LEVEL 1",
    registerValue: "$50",
    commission: "8%",
    income: "$250",
    gradient: "from-[#22daff] via-[#218cdc] to-[#6162b4]",
  },
  {
    level: "LEVEL 2",
    registerValue: "$50",
    commission: "3%",
    income: "$250",
    gradient: "from-[#ac30de] via-[#6d11f2] to-[#4806f4]",
  },
  {
    level: "LEVEL 3",
    registerValue: "$50",
    commission: "1%",
    income: "$250",
    gradient: "from-[#f637b0] via-[#4a3881] to-[#2c80c3]",
  },
];

export default function LevelCard() {
  return (
    <div className="w-full">
      <div className="flex gap-2 w-full justify-start items-center py-2">
        {levels.map((item, index) => (
          <div
            key={index}
            className={`relative w-full h-74 rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br ${item.gradient} text-white transform transition hover:scale-105`}
          >
            {/* Level Tag */}
            <div className="absolute top-3 -left-13 w-40 rotate-[-45deg] bg-orange-400 backdrop-blur-sm shadow-md z-20">
              <p className="text-center text-sm font-bold uppercase tracking-wide py-1 text-gray-900">
                {item.level}
              </p>
            </div>

            {/* Inner Glass Content */}
            <div className="absolute inset-0 mx-4 mt-10 mb-4 flex flex-col items-center justify-center  text-center space-y-2 backdrop-blur-lg bg-white/10 rounded-2xl z-10">
              <p className="text-xs font-medium drop-shadow">
                Register / Valid
                <br />
                <span className="text-sm font-bold">{item.registerValue}</span>
              </p>
              <p className="text-xs font-medium drop-shadow">
                Commission Percentage
                <br />
                <span className="text-sm font-bold">{item.commission}</span>
              </p>
              {/* <p className="text-xs font-medium drop-shadow">
                Total Income
                <br />
                <span className="text-sm font-bold">{item.income}</span>
              </p> */}
              <Button className="px-8 py-1 mt-8 w-3/4 bg-black/90 hover:bg-black/60 text-white font-semibold rounded-2xl shadow-lg">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
