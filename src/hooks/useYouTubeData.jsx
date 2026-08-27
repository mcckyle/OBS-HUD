//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 26 August 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import { useState, useEffect, useRef } from 'react';

//API.
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const CHANNELS_ENDPOINT = "channels";
const COMMENT_THREADS_ENDPOINT = "commentThreads";

//Polling.
const POLL_INTERVAL_MS = 2 * 60 * 1000;

//Display.
const MAX_COMMENT_LENGTH = 72;
const INITIAL_SUBSCRIBER_COUNT = "---";
const DEFAULT_MESSAGES = Object.freeze({
  connecting: Object.freeze({
    id: "connecting",
    author: "",
    message: "CONNECTING...",
  }),
  empty: Object.freeze({
    id: "empty",
    author: "",
    message: "NO RECENT TRANSMISSIONS",
  }),
  error: Object.freeze({
    id: "error",
    author: "",
    message: "SIGNAL LOST",
  }),
  config: Object.freeze({
    id: "config",
    author: "",
    message: "MISSING CONFIGURATION",
  }),
});

function getYouTubeConfig()
{
  //Read API credentials from the Browser Souce URL.
  const params = new URLSearchParams(window.location.search);

  return {
    apiKey: params.get("key")?.trim() ?? "",
    channelId: params.get("channelId")?.trim() ?? "",
  };
}

function createYouTubeUrl(endpoint, params)
{
  const searchParams = new URLSearchParams(params);
  return `${YOUTUBE_API}/${endpoint}?${searchParams.toString()}`;
}

function truncateComment(text)
{
  const normalized = text?.trim() ?? "";

  if (normalized.length <= MAX_COMMENT_LENGTH)
  {
    return normalized;
  }

  const truncated = normalized.slice(0, MAX_COMMENT_LENGTH);
  const clean = truncated.replace(/\s+\S*$/, "").trimEnd();

  return `${clean}…`;
}

const SUBSCRIBER_FORMATTER = new Intl.NumberFormat("en-US");
function formatSubscriberCount(count)
{
  const value = Number(count);
  return Number.isFinite(value)
    ? SUBSCRIBER_FORMATTER.format(value)
    : INITIAL_SUBSCRIBER_COUNT;
}

export function useYouTubeData()
{
  const [subscriberCount, setSubscriberCount] = useState(INITIAL_SUBSCRIBER_COUNT);
  const [latestMessage, setLatestMessage] = useState(DEFAULT_MESSAGES.connecting);
  const requestControllerRef = useRef(null);
  const { apiKey, channelId } = getYouTubeConfig();

  useEffect(() =>
  {
    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
      console.warn("Missing YouTube configuration in Browser Source URL.");
      setLatestMessage(DEFAULT_MESSAGES.config);
      return;
    }

    let disposed = false;

    const refreshYouTubeData = async () =>
    {
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      requestControllerRef.current = controller;

      const requestOptions = { signal: controller.signal, };

      const statsUrl = createYouTubeUrl(CHANNELS_ENDPOINT, {
        part: "statistics",
        id: channelId,
        key: apiKey,
      });

      const commsUrl = createYouTubeUrl(COMMENT_THREADS_ENDPOINT, {
        part: "snippet",
        allThreadsRelatedToChannelId: channelId,
        maxResults: "1",
        order: "time",
        key: apiKey,
      });

      try
      {
        //1. Fetch subscriber statistics.
        const [statsResponse, commsResponse] = await Promise.all([
          fetch(statsUrl, requestOptions),
          fetch(commsUrl, requestOptions),
        ]);

        if (disposed)
        {
          return;
        }

        if (statsResponse.ok)
        {
            const statsData = await statsResponse.json();
            const count = statsData.items?.[0]?.statistics?.subscriberCount;

            if (count != null)
            {
              //Format to nicely readable string e.g. "1,250".
              setSubscriberCount(formatSubscriberCount(count));
            }
        }
        else
        {
          console.warn(`YouTube statistics request failed: ${statsResponse.status}`);
        }

        if (!commsResponse.ok)
        {
          console.warn(`YouTube comments request failed: ${commsResponse.status}`);
          setLatestMessage(DEFAULT_MESSAGES.error);
          return;
        }

        const commsData = await commsResponse.json();

        //2. Fetch latest channel comment.
        const latestThread = commsData.items?.[0];
        const comment = latestThread?.snippet?.topLevelComment?.snippet;

        if ((!latestThread) || (!comment))
        {
          setLatestMessage(DEFAULT_MESSAGES.empty);
          return;
        }

        setLatestMessage({
            id: latestThread.id,
            author: comment.authorDisplayName?.trim() || "UNKNOWN",
            message: truncateComment(comment.textDisplay),
        });
      }
      catch (error)
      {
        if ((error.name === "AbortError") || (disposed))
        {
          return;
        }

        console.error("Error fetching data from YouTube API:", error);
        setLatestMessage(DEFAULT_MESSAGES.error);
      }
      finally
      {
        if (requestControllerRef.current === controller)
        {
          requestControllerRef.current = null;
        }
      }
    };

    //Initial fetch.
    refreshYouTubeData();

    //Poll YouTube once every 2 minutes.
    const pollInterval = setInterval(refreshYouTubeData, POLL_INTERVAL_MS);

    return () =>
    {
        disposed = true;

        requestControllerRef.current?.abort();
        requestControllerRef.current = null;

        clearInterval(pollInterval);
    };
  }, [apiKey, channelId]);

  return { subscriberCount, latestMessage };
};
