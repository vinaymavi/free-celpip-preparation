import { useState, useEffect, useRef } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
  showControls?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  sticky?: boolean;
}

export default function Timer({
  initialMinutes = 0,
  initialSeconds = 0,
  autoStart = false,
  onTimeUp,
  showControls = true,
  size = "md",
  className = "",
  sticky = true,
}: TimerProps) {
  const initialTotalSeconds = initialMinutes * 60 + initialSeconds;
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCountdown] = useState(initialTotalSeconds > 0);
  const [isSticky, setIsSticky] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<HTMLDivElement | null>(null);
  const originalPositionRef = useRef<{ top: number; left: number } | null>(
    null
  );
  const isStickyRef = useRef(false);

  // Calculate minutes and seconds from totalSeconds
  const minutes =
    Math.floor(Math.abs(totalSeconds) / 60) * (totalSeconds < 0 ? -1 : 1);
  const seconds = (Math.abs(totalSeconds) % 60) * (totalSeconds < 0 ? -1 : 1);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "text-sm",
      time: "text-lg font-mono",
      button: "w-6 h-6",
      icon: "w-3 h-3",
    },
    md: {
      container: "text-base",
      time: "text-xl font-mono",
      button: "w-8 h-8",
      icon: "w-4 h-4",
    },
    lg: {
      container: "text-lg",
      time: "text-2xl font-mono",
      button: "w-10 h-10",
      icon: "w-5 h-5",
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (isCountdown) {
          // Countdown timer
          setTotalSeconds((prevTotal) => {
            if (prevTotal === 0 && onTimeUp) {
              // Time's up! Call the callback but continue running
              onTimeUp();
            }
            return prevTotal - 1; // Continue counting into negative
          });
        } else {
          // Stopwatch timer
          setTotalSeconds((prevTotal) => prevTotal + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isCountdown, onTimeUp]);

  // Enhanced sticky positioning with scroll detection
  useEffect(() => {
    if (!sticky || !timerRef.current) return;

    const timerElement = timerRef.current;

    // Store original position (only once)
    if (!originalPositionRef.current) {
      const rect = timerElement.getBoundingClientRect();
      originalPositionRef.current = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }

    const handleScroll = () => {
      if (!timerElement || !originalPositionRef.current) return;

      const rect = timerElement.getBoundingClientRect();
      const threshold = 20; // Distance from top of viewport

      // Check if timer is about to scroll out of view
      const shouldStick = rect.top <= threshold && !isStickyRef.current;
      const shouldUnstick =
        window.scrollY < originalPositionRef.current.top - threshold &&
        isStickyRef.current;

      if (shouldStick) {
        isStickyRef.current = true;
        setIsSticky(true);
      } else if (shouldUnstick) {
        isStickyRef.current = false;
        setIsSticky(false);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [sticky]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (isCountdown) {
      setTotalSeconds(initialTotalSeconds);
    } else {
      setTotalSeconds(0);
    }
  };

  const formatTime = (mins: number, secs: number) => {
    // Show negative sign for negative time
    const isNegative = mins < 0 || secs < 0;
    const displayMins = Math.abs(mins);
    const displaySecs = Math.abs(secs);
    const timeString = `${displayMins.toString().padStart(2, "0")}:${displaySecs
      .toString()
      .padStart(2, "0")}`;
    return isNegative ? `-${timeString}` : timeString;
  };

  const getTimeColor = () => {
    if (!isCountdown) return "text-blue-600";

    // Red color for negative time (overtime)
    if (totalSeconds < 0) return "text-red-600";

    // Prevent division by zero
    if (initialTotalSeconds <= 0) return "text-red-600";

    const remaining = totalSeconds / initialTotalSeconds;

    if (remaining > 0.5) return "text-green-600";
    if (remaining > 0.25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      ref={timerRef}
      className={`flex items-center space-x-3 ${
        config.container
      } ${className} ${
        sticky && isSticky
          ? "fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 animate-in slide-in-from-top-2"
          : ""
      }`}
    >
      <div className="flex items-center space-x-2">
        <ClockIcon className={`${config.icon} text-gray-500`} />
        <span className={`${config.time} ${getTimeColor()} font-semibold`}>
          {formatTime(minutes, seconds)}
        </span>
      </div>

      {showControls && (
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePlayPause}
            className={`${config.button} flex items-center justify-center rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors`}
            title={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? (
              <PauseIcon className={config.icon} />
            ) : (
              <PlayIcon className={config.icon} />
            )}
          </button>

          <button
            onClick={handleStop}
            className={`${config.button} flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors`}
            title="Stop"
          >
            <StopIcon className={config.icon} />
          </button>
        </div>
      )}
    </div>
  );
}
