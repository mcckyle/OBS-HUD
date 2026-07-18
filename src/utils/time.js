//Filename: time.js
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains a custom time formatter/UTC utility for the OBS HUD project.

export function formatTime(totalSeconds)
{
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export function formatMissionTime(date = new Date())
{
  const time = date.toISOString().slice(11, 19);
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 0);
  const currentDay = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());

  const sol = String(Math.floor((currentDay - startOfYear) / 86400000)).padStart(3, "0");

  return { time, sol: `${year}.${sol}`};
};
