//Filename: LiveChatPanel.jsx
//Author: Kyle McColgan
//Date: 17 November 2026
//Description: This file contains the live chat panel component for the OBS HUD project.

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './LiveChatPanel.css';

const MESSAGE_VARIANTS = {
    initial: { opacity: 0, y: 4, },
    enter: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1], }, },
    exit: { opacity: 0, y: -3, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1], }, },
};

export default function LiveChatPanel({ messages = [] })
{
    const reduceMotion = useReducedMotion();
    if (messages.length === 0)
    {
        return null;
    }

    return (
      <div className="hud-chat">
        <AnimatePresence initial={false}>
          {messages.slice(-3).map(message => (
              <motion.article
                key={message.id}
                className="hud-chat-message"
                initial={reduceMotion ? false : 'initial'}
                animate={reduceMotion ? undefined : 'enter'}
                exit={reduceMotion ? undefined : 'exit'}
                variants={reduceMotion ? undefined : MESSAGE_VARIANTS}
              >
                <p className="hud-chat-author">{message.author}</p>
                <p className="hud-chat-text">{message.message}</p>
              </motion.article>
        ))}
        </AnimatePresence>
      </div>
    );
}
