import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen -mt-16 overflow-hidden -mb-16 -mx-4 bg-white">
      {/* Simple header like RS Group's minimal top bar */}
      <div className="border-b border-[#F2F2F2]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">RS Group</span>
            <span className="text-xs text-[#6B6B6B]">•</span>
            <span className="text-xs text-[#6B6B6B]">404 Error</span>
          </div>
        </div>
      </div>

      {/* Main content - centered like RS Group's content blocks */}
      <div className="flex items-center justify-center px-4" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="max-w-md w-full">
          {/* Content container - like RS Group's card sections */}
          <div className="bg-white border border-[#F2F2F2] rounded-md p-8">
            {/* Error code - large like RS Group's section headers */}
            <div className="text-center mb-6">
              <h1 className="text-7xl font-bold text-black tracking-tight">404</h1>
              <div className="w-12 h-0.5 bg-[#E5E5E5] mx-auto mt-3 mb-4"></div>
              <p className="text-base text-[#4D4D4D]">
                The page you're looking for doesn't exist or has been moved
              </p>
            </div>

            {/* Action buttons - like RS Group's CTA section */}
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-black text-white text-center py-3 px-4 rounded-md text-sm font-medium hover:bg-[#333333] transition-colors"
              >
                Go to Dashboard
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="block w-full bg-white border border-[#E5E5E5] text-[#4D4D4D] text-center py-3 px-4 rounded-md text-sm font-medium hover:bg-[#F9F9F9] transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Help text - like RS Group's support links */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[#6B6B6B] mb-2">
                Need assistance? Contact our support team
              </p>
              <Link 
                to="/contact" 
                className="text-xs text-black border-b border-[#E5E5E5] hover:border-black pb-0.5 transition-colors"
              >
                Get Help
              </Link>
            </div>
          </div>

          {/* Footer note - like RS Group's page footer */}
          <p className="text-center text-xs text-[#6B6B6B] mt-6">
            RS Group • Error 404 • Page Not Found
          </p>
        </div>
      </div>

      {/* Simple footer like RS Group */}
      <div className="border-t border-[#F2F2F2] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B6B6B]">© 2025 RS Group</span>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-[#6B6B6B] hover:text-black transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-xs text-[#6B6B6B] hover:text-black transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;