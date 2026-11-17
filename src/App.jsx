//Filename: App.jsx
//Author: Kyle McColgan
//Date: 16 November 2026
//Description: This file contains the App component for the OBS HUD project.

import { motion, useReducedMotion } from 'motion/react';
import { useYouTubeData } from "./hooks/useYouTubeData";
import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import SessionTimer from "./components/SessionTimer/SessionTimer.jsx";
import ViewerCount from "./components/ViewerCount/ViewerCount.jsx";
import LiveChatPanel from "./components/LiveChatPanel/LiveChatPanel.jsx";

import './App.css';

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 5, },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], }, },
};

export default function App()
{
  const reduceMotion = useReducedMotion();
  const { viewerCount, chatMessages, chatEnabled } = useYouTubeData();

  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">
      <motion.section
        className="hud-panel"
        aria-label="Starfield livestream HUD"
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={reduceMotion ? undefined : PANEL_VARIANTS}
      >
        {/* System Header. */}
        <HudHeader />

        <div className="hud-sections">
          {/* Session. */}
          <HudSection label="ELAPSED TIME">
            <SessionTimer />
          </HudSection>

          {/* Section 2: Concurrent Viewer Count. */}
          <HudSection label="CONCURRENT VIEWERS">
            <ViewerCount viewerCount={viewerCount} />
          </HudSection>

          {/* Section 3: Comms. */}
          {chatEnabled && chatMessages.length > 0 && (
            <HudSection label="LIVE CHAT">
              <LiveChatPanel messages={chatMessages} />
            </HudSection>
          )}
        </div>
      </motion.section>
    </main>
  );
};
