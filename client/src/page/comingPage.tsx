import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className=" min-h-screen  p-2">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-10 p-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 text-gray-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center mt-2 p-4 rounded-2xl bg-gradient-to-br from-blue-400/30 to-cyan-400/30 max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-full border border-amber-500/30 flex items-center justify-center">
              <span className="text-4xl">🔧</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-3">
          Feature Coming Soon
        </h1>

        <p className="text-gray-400 text-center mb-8">
          This feature is will be available soon.
        </p>

        {/* Status Card */}
        {/* <div className="w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">In Development</span>
            </div>
            <span className="text-amber-400 font-bold">75%</span>
          </div>

          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: "75%" }}
            ></div>
          </div>

          <p className="text-sm text-gray-400">
            Estimated launch: <span className="text-amber-300">2-3 weeks</span>
          </p>
        </div> */}

        {/* Info Box */}
        <div className="w-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/30 p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-blue-400 text-sm">💡</span>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">What's Coming?</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  New earning methods
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Enhanced security features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Better user interface
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 active:scale-95"
          >
            Go to Home
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800/70 transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Social Links */}
        {/* <div className="mt-12">
          <p className="text-gray-500 text-center text-sm mb-4">Stay Updated</p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-amber-500/50 transition-colors"
            >
              <span className="text-lg">📢</span>
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-amber-500/50 transition-colors"
            >
              <span className="text-lg">💬</span>
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-amber-500/50 transition-colors"
            >
              <span className="text-lg">📧</span>
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
