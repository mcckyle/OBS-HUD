//Filename: ViewerCount.jsx
//Author: Kyle McColgan
//Date: 16 November 2026
//Description: This file contains the viewer count component for the OBS HUD project.

import { motion, useReducedMotion } from 'motion/react';

import "./ViewerCount.css";

const COUNT_VARIANTS = {
    initial: { opacity: 0.65, y: -2, },
    enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1], }, },
};

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export default function ViewerCount({ viewerCount })
{
    const reduceMotion = useReducedMotion();
    const formattedCount = Number.isFinite(viewerCount)
      ? NUMBER_FORMATTER.format(viewerCount)
      : "-";

    return (
        <output
          className="hud-viewer-count"
          aria-label={
              Number.isFinite(viewerCount)
                ? `${formattedCount} concurrent viewers`
                : "Concurrent viewers unavailable"
          }
          aria-live="off"
        >
            <motion.span
              key={formattedCount}
              className="hud-viewer-value"
              initial={reduceMotion ? false : "initial"}
              animate={reduceMotion ? undefined : "enter"}
              variants={reduceMotion ? undefined : COUNT_VARIANTS}
            >
                {formattedCount}
            </motion.span>
        </output>
    );
}
