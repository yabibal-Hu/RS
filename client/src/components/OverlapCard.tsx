
export default function OverlapCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-900">
    // {/* Outer Card */}
    <div className="relative w-80 h-48 ">
      {/* Bottom/Right Overlap */}
      <div className="absolute bottom-0  right-0 w-full h-full bg-secondary rounded-xl translate-x-2 translate-y-2 "></div>

      {/* Main Card */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-gray-100 text-white rounded-xl p-6 shadow-lg ${
          className ?? ""
        }`}
        {...props}
      >
        {props.children}
      </div>
    </div>
    // </div>
  );
}
