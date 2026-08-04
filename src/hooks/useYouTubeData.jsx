//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 30 July 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import React, { useState, useEffect, useRef, useMemo } from 'react';

//API.
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

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
  const params = new URLSearchParams(window.location.search ?? "");

  return {
    apiKey: params.get("key")?.trim(),
    channelId: params.get("channelId")?.trim(),
  };
}

function createYouTubeUrl(endpoint, params)
{
  const searchParams = new URLSearchParams(params);
  return `${YOUTUBE_API}/${endpoint}?${searchParams}`;
}

function truncateComment(text)
{
  const normalized = text?.trim() ?? "";

  if (normalized.length <= MAX_COMMENT_LENGTH)
  {
    return normalized;
  }

  return `${normalized.slice(0, MAX_COMMENT_LENGTH).trimEnd()}…`;
}

const SUBSCRIBER_FORMATTER = new Intl.NumberFormat("en-US");
function formatSubscriberCount(count)
{
  return SUBSCRIBER_FORMATTER.format(Number(count));
}

export function useYouTubeData()
{
  const [subscriberCount, setSubscriberCount] = useState(INITIAL_SUBSCRIBER_COUNT);
  const [latestMessage, setLatestMessage] = useState(DEFAULT_MESSAGES.connecting);
  const requestControllerRef = useRef(null);
  const { apiKey, channelId } = useMemo(
    getYouTubeConfig,
    []
  );
  const CHANNELS_ENDPOINT = "channels";
  const COMMENTS_ENDPOINT = "commentThreads"

  useEffect(() =>
  {
    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
      console.warn("Missing YouTube configuration keys in Browser Source URL.");
      setLatestMessage(DEFAULT_MESSAGES.config);
      return;
    }

    let disposed = false;

    const refreshYouTubeData = async () =>
    {
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      const fetchOptions = { signal: controller.signal, };
      requestControllerRef.current = controller;

      const statsUrl = createYouTubeUrl(CHANNELS_ENDPOINT, {
        part: "statistics",
        id: channelId,
        key: apiKey,
      });

      const commsUrl = createYouTubeUrl(COMMENTS_ENDPOINT, {
        part: "snippet",
        allThreadsRelatedToChannelId: channelId,
        maxResults: "1",
        key: apiKey,
      });

      try
      {
        //1. Fetch subscriber statistics.
        const [statsResponse, commsResponse] = await Promise.all([fetch(statsUrl, fetchOptions), fetch(commsUrl, fetchOptions),]);

        if (!statsResponse.ok)
        {
            throw new Error(`YouTube statistics request failed: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        const commsData = commsResponse.ok ? await commsResponse.json() : null;

        if (disposed)
        {
          return;
        }

        const count = statsData.items?.[0]?.statistics?.subscriberCount;

        if (count != null)
        {
          //Format to nicely readable string e.g. "1,250".
          setSubscriberCount(formatSubscriberCount(count));
        }

        if (!commsResponse.ok)
        {
          setLatestMessage(DEFAULT_MESSAGES.error);
          return;
        }

        //2. Fetch latest channel comment.
        const comment = commsData?.items?.[0]?.snippet?.topLevelComment?.snippet;

        if (!comment)
        {
          setLatestMessage(DEFAULT_MESSAGES.empty);
          return;
        }

        setLatestMessage({
            id: commsData.items[0].id,
            author: comment.authorDisplayName,
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
