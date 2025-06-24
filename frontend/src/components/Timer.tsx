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
}

export default function Timer({
  initialMinutes = 0,
  initialSeconds = 0,
  autoStart = false,
  onTimeUp,
  showControls = true,
  size = "md",
  className = "",
}: TimerProps) {
  const initialTotalSeconds = initialMinutes * 60 + initialSeconds;
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCountdown] = useState(initialTotalSeconds > 0);
  const intervalRef = useRef<number | null>(null);

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
      className={`flex items-center space-x-3 ${config.container} ${className}`}
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
