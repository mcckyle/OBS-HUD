//Filename: HudHeader.jsx
//Author: Kyle McColgan
//Date: 17 November 2026
//Description: This file contains the HUD header component for the OBS HUD project.

import { useMissionClock } from '../../hooks/useMissionClock';
import './HudHeader.css';

export default function HudHeader()
{
  const missionTime = useMissionClock();

  return (
    <header className="hud-header">
      <div className="hud-system">
        <h1 className="hud-title">STARFIELD LIVE</h1>
        <span className="hud-system-id">MCCKYLE</span>
      </div>
      <div className="hud-clock">
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
