import { useState, useEffect, useRef, useCallback } from "react";
import {
  // ChevronLeft,
  ChevronRight,
  TrendingUp,
  Crown,
  Star,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const slides = [
  {
    image: "/images/system/company.jpeg",
    title: "",
    description:
      "Experience luxury trading with high-yield opportunities and exclusive benefits.",
    icon: Crown,
    gradient: "from-amber-400 to-orange-400",
    ctaText: "Start Investing",
    ctaLink: "/deposit",
  },
  {
    image: "/images/system/product.webp",
    title: "Elite VIP Benefits",
    description:
      "Unlock exclusive rewards, higher returns, and personalized support.",
    icon: Star,
    gradient: "from-amber-400 to-orange-400",
    ctaText: "View VIP Levels",
    ctaLink: "/product",
  },
  {
    image: "/images/system/impact.jpg",
    title: "Daily Tasks & Rewards",
    description:
      "Complete daily tasks and earn passive income with our innovative platform.",
    icon: Award,
    gradient: "from-amber-400 to-orange-400",
    ctaText: "Start Earning",
    ctaLink: "/task",
  },
  {
    image: "/images/system/store.jpeg",
    title: "Referral Program",
    description:
      "Invite friends and earn lifetime commissions on their investments.",
    icon: TrendingUp,
    gradient: "from-amber-400 to-orange-400",
    ctaText: "Refer Now",
    ctaLink: "/referral",
  },
];

export default function LandingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto scroll with pause/resume functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => prev + 1);
      }, 5000);
    }
  }, [isPlaying]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [startAutoPlay]);

  // Handle slide transition
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const slideWidth = container.clientWidth;
    const totalSlides = slides.length;

    if (currentSlide >= totalSlides && !isResetting.current) {
      isResetting.current = true;
      setTimeout(() => {
        container.scrollTo({ left: 0, behavior: "auto" });
        setCurrentSlide(0);
        isResetting.current = false;
      }, 50);
      return;
    }

    if (currentSlide < 0 && !isResetting.current) {
      isResetting.current = true;
      const resetTo = totalSlides - 1;
      container.scrollTo({
        left: resetTo * slideWidth,
        behavior: "auto",
      });
      setTimeout(() => {
        setCurrentSlide(resetTo);
        isResetting.current = false;
      }, 50);
      return;
    }

    const targetSlide = currentSlide % totalSlides;
    container.scrollTo({
      left: targetSlide * slideWidth,
      behavior: "smooth",
    });
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => prev - 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startAutoPlay();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const actualSlide = currentSlide % slides.length;

  return (
    <div
      className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl shadow-xl group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-orange-400/5 -z-10"></div>

      {/* Slides Container */}
      <div
        ref={containerRef}
        className="flex w-full h-full overflow-x-hidden scrollbar-hide snap-x snap-mandatory relative"
      >
        {[...slides, ...slides].map((slide, idx) => {
          const isActive = idx % slides.length === actualSlide;
          const SlideIcon = slide.icon;

          return (
            <div
              key={idx}
              className="w-full h-full shrink-0 relative snap-center"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-fit object-cover"
                  loading={idx < 2 ? "eager" : "lazy"}
                />

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-orange-900/40"></div>

                {/* Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="80" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative z-30 h-full flex flex-col justify-center p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isActive ? 1 : 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-4 shadow-xl"
                  >
                    <SlideIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 leading-tight">
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/80 mb-4 max-w-2xl">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white text-sm sm:text-base font-medium rounded-xl shadow-lg flex items-center gap-2 group/btn"
                  >
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 rounded-xl"></div>
                  </motion.button>
                </motion.div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-6 right-6 w-20 h-20 bg-gradient-to-tl from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      {/* <>
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
          backdrop-blur-xl bg-white/10 border border-white/20 hover:border-amber-400/50 text-white hover:text-amber-400 
          rounded-xl flex items-center justify-center transition-all duration-300 z-30
          opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
          backdrop-blur-xl bg-white/10 border border-white/20 hover:border-amber-400/50 text-white hover:text-amber-400 
          rounded-xl flex items-center justify-center transition-all duration-300 z-30
          opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </> */}

      {/* Controls Container */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center z-30 px-4">
        <div className="flex items-center gap-3 backdrop-blur-xl bg-black/20 rounded-full px-3 py-1.5 border border-white/10">
          {/* Navigation Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`relative transition-all duration-300 ${
                  idx === actualSlide ? "w-6" : "w-1.5"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === actualSlide
                      ? "w-6 bg-gradient-to-r from-amber-400 to-orange-400"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Play/Pause Indicator */}
          <div className="w-px h-3 bg-white/20 mx-1"></div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isPlaying ? (
              <div className="w-3 h-3 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
              </div>
            ) : (
              <div className="w-3 h-3 flex items-center justify-center gap-0.5">
                <div className="w-0.5 h-2 bg-white/70"></div>
                <div className="w-0.5 h-2 bg-white/70"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
          initial={{ width: "0%" }}
          animate={{
            width: isPlaying && !isHovering ? "100%" : "0%",
          }}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: isPlaying && !isHovering ? Infinity : 0,
          }}
        />
      </div>

      {/* Floating Elements - Luxury Style */}
      <div className="absolute top-1/4 left-8 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-md opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-12 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-lg opacity-30 animate-pulse delay-500"></div>

      {/* Gold Sparkle Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Custom Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
