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
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCountdown] = useState(initialMinutes > 0 || initialSeconds > 0);
  const intervalRef = useRef<number | null>(null);

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
          setSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            } else if (minutes > 0) {
              setMinutes((prevMinutes) => prevMinutes - 1);
              return 59;
            } else {
              // Time's up!
              setIsRunning(false);
              if (onTimeUp) {
                onTimeUp();
              }
              return 0;
            }
          });
        } else {
          // Stopwatch timer
          setSeconds((prevSeconds) => {
            if (prevSeconds >= 59) {
              setMinutes((prevMinutes) => prevMinutes + 1);
              return 0;
            }
            return prevSeconds + 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes, isCountdown, onTimeUp]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (isCountdown) {
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
    } else {
      setMinutes(0);
      setSeconds(0);
    }
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (!isCountdown) return "text-blue-600";

    const totalSeconds = minutes * 60 + seconds;
    const initialTotal = initialMinutes * 60 + initialSeconds;
    const remaining = totalSeconds / initialTotal;

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
