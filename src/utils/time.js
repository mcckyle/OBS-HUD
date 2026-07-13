//Filename: time.js
//Author: Kyle McColgan
//Date: 12 July 2026
//Description: This file contains a custom time formatter/UTC utility for the OBS HUD project.

export function formatTime(totalSeconds) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export function formatMissionTime(date = new Date()) {
  const time = date.toISOString().slice(11, 19);
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 0);
  const now = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());

  const sol = String(Math.floor((now - start) / 86400000)).padStart(3, "0");

  return { time, sol: `${year}.${sol}`};
};
