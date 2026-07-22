//Filename: HudHeader.jsx
//Author: Kyle McColgan
//Date: 21 July 2026
//Description: This file contains the HUD header component for the OBS HUD project.

import { useMissionClock } from "../../hooks/useMissionClock";
import "./HudHeader.css";

export default function HudHeader()
{
  const missionTime = useMissionClock();

  return (
    <header className="hud-header">
      <section className="hud-system" aria-label="System information">
        <h1 className="hud-title">STARFIELD LIVE</h1>
        <span className="hud-system-id">CONSTELLATION NETWORK</span>
      </section>
      <section className="hud-clock" aria-label="Mission time">
        <span className="hud-clock-sol">SOL {missionTime.sol}</span>
        <time className="hud-clock-time" dateTime={missionTime.time}>
          {missionTime.time} UTC
        </time>
      </section>
    </header>
  );
}
