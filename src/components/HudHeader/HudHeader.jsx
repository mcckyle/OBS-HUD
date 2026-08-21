//Filename: HudHeader.jsx
//Author: Kyle McColgan
//Date: 20 August 2026
//Description: This file contains the HUD header component for the OBS HUD project.

import { useMissionClock } from "../../hooks/useMissionClock";
import "./HudHeader.css";

export default function HudHeader()
{
  const missionTime = useMissionClock();

  return (
    <header className="hud-header" aria-labelledby="hud-title">
      <div className="hud-system">
        <h1 id="hud-title" className="hud-title">STARFIELD LIVE</h1>
        <span className="hud-system-id">mcckyle</span>
      </div>
      <div className="hud-clock" aria-label="Mission telemetry" aria-live="off">
        <span className="hud-clock-sol">
          SOL {missionTime.sol}
        </span>
        <time className="hud-clock-time" dateTime={missionTime.time}>
          {missionTime.time} UTC
        </time>
      </div>
    </header>
  );
}
