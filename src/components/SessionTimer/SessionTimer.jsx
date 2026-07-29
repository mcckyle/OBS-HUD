//Filename: SessionTimer.jsx
//Author: Kyle McColgan
//Date: 28 July 2026
//Description: This file contains the session timer component for the OBS HUD project.

import { formatTime } from "../../utils/time";
import { useSessionTimer } from "../../hooks/useSessionTimer";
import "./SessionTimer.css";

export default function SessionTimer()
{
  const seconds = useSessionTimer();
  const formattedTime = formatTime(seconds);

  return (
    <time
      className="session-timer"
      dateTime={`PT${seconds}S`}
      aria-label={`Session elapsed time: ${formattedTime}`}
      aria-live="off"
    >
      {formattedTime}
    </time>
  );
}
