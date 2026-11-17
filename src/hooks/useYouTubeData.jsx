//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 16 November 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import { useState, useEffect } from 'react';

//API.
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const SEARCH_ENDPOINT = "search";
const VIDEOS_ENDPOINT = "videos";
const LIVE_CHAT_ENDPOINT = "liveChat/messages";

//Polling.
const DISCOVERY_INTERVAL_MS = 5 * 60 * 1000;
const VIEWER_POLL_INTERVAL_MS = 60 * 1000;
const CHAT_RETRY_INTERVAL_MS = 15 * 1000;

//Display.
const MAX_CHAT_MESSAGES = 3;
const CHAT_MAX_RESULTS = 200;
const MAX_MESSAGE_LENGTH = 100;
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

async function fetchYouTube(endpoint, params, apiKey, signal)
{
  //Read API credentials from the Browser Souce URL.
  const url = new URL(`${YOUTUBE_API}/${endpoint}`);

  for (const [key, value] of Object.entries(params))
  {
    if (value != null)
    {
      url.searchParams.set(key, value);
    }
  }

  url.searchParams.set("key", apiKey);
  const response = await fetch(url, { signal });
  const data = await response.json();

  if (!response.ok)
  {
    throw new Error(data.error?.message || `YouTube API error: ${response.status}`);
  }

  return data;
}

function truncateMessage(text)
{
  const normalized = text?.trim() ?? "";

  if (normalized.length <= MAX_MESSAGE_LENGTH)
  {
    return normalized;
  }

  //Reserve one character for the ellipsis...
  const limit = MAX_MESSAGE_LENGTH - 1;
  const boundary = normalized.lastIndexOf(" ", limit);
  const end = boundary > 0 ? boundary : limit;

  return `${normalized.slice(0, end).trimEnd()}…`;
}

export function useYouTubeData()
{
  const [streamStatus, setStreamStatus] = useState("connecting");
  const [viewerCount, setViewerCount] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [chatStatus, setChatStatus] = useState("waiting");
  const [error, setError] = useState(null);
  const { apiKey, channelId } = getYouTubeConfig();

  useEffect(() =>
  {
    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
      setStreamStatus("config");
      setError("Missing YouTube API configuration.");
      return;
    }

    let disposed = false;
    let discoveryTimer = null;
    let viewerTimer = null;
    let chatTimer = null;
    let activeVideoId = null;
    let activeChatId = null;
    let pageToken = null;
    const seenMessageIds = new Set();
    const controller = new AbortController();
    const request = (endpoint, params) =>
      fetchYouTube(endpoint, params, apiKey, controller.signal);

    function clearChat()
    {
      clearTimeout(chatTimer);
      activeChatId = null;
      pageToken = null;
      seenMessageIds.clear();
      setChatMessages([]);
      setChatEnabled(false);
      setChatStatus("waiting");
    }

    function scheduleDiscovery()
    {
      if (disposed)
      {
        return;
      }

      clearTimeout(discoveryTimer);

      discoveryTimer = setTimeout(discoveryBroadcast, DISCOVERY_INTERVAL_MS);
    }

    //1. Discover the active public broadcast.
    async function discoveryBroadcast()
    {
      if (disposed)
      {
        return;
      }

      try
      {
        const data = await request(SEARCH_ENDPOINT, {
          part: "snippet",
          channelId,
          eventType: "live",
          type: "video",
          order: "date",
          maxResults: "1",
        });

        if (disposed)
        {
          return;
        }

        const videoId = data.items?.[0]?.id?.videoId;

        if (!videoId)
        {
          activeVideoId = null;
          setStreamStatus("offline");
          setViewerCount(null);
          clearChat();
          scheduleDiscovery();
          return;
        }

        activeVideoId = videoId;
        await refreshBroadcast();
      }
      catch (err)
      {
        if ((disposed) || (err.name === "AbortError"))
        {
          return;
        }

        console.error("Broadcast discovery failed:", err);
        setStreamStatus("error");
        setError(err.message);
        scheduleDiscovery();
      }
    }

    //2. Retrieve viewer statistics and active chat ID.
    async function refreshBroadcast()
    {
      if ((disposed) || (!activeVideoId))
      {
        return;
      }

      try
      {
        const data = await request(VIDEOS_ENDPOINT, {
          part: "liveStreamingDetails",
          id: activeVideoId,
        });

        if (disposed)
        {
          return;
        }

        const video = data.items?.[0];
        const details = video?.liveStreamingDetails;

        if ((!video) || (!details) || (details.actualEndTime))
        {
          activeVideoId = null;
          setStreamStatus("offline");
          setViewerCount(null);
          clearChat();
          scheduleDiscovery();
          return;
        }

        setStreamStatus("live");
        setError(null);
        const viewers = details.concurrentViewers;
        setViewerCount(viewers != null && Number.isFinite(Number(viewers)) ? Number(viewers) : null);

        //Discover chat whenever the active chat ID changes.
        const chatId = details.activeLiveChatId ?? null;

        if (chatId !== activeChatId)
        {
          clearChat();

          if (chatId)
          {
            activeChatId = chatId;
            setChatEnabled(true);
            setChatStatus("connecting");
            pollChat();
          }
          else
          {
            setChatStatus("disabled");
          }
        }

        viewerTimer = setTimeout(refreshBroadcast, VIEWER_POLL_INTERVAL_MS);
      }
      catch (err)
      {
        if ((disposed) || (err.name === "AbortError"))
        {
          return;
        }

        console.error("Broadcast telemetry failed:", err);
        setError(err.message);
        viewerTimer = setTimeout(refreshBroadcast, VIEWER_POLL_INTERVAL_MS);
      }
    }

    //3. Retrieve actual YouTube live chat messages.
    async function pollChat(nextPageToken = pageToken)
    {
      if ((disposed) || (!activeChatId))
      {
        return;
      }

      try
      {
        const data = await request(LIVE_CHAT_ENDPOINT, {
          part: "id,snippet,authorDetails",
          liveChatId: activeChatId,
          maxResults: String(CHAT_MAX_RESULTS),
          pageToken: nextPageToken,
        });

        const incomingMessages = (data.items ?? [])
          .filter(item =>
            item.snippet?.type === "textMessageEvent" &&
            item.snippet?.textMessageDetails?.messageText
          )
          .map(item => ({
            id: item.id,
            author: item.authorDetails?.displayName?.trim() || "UNKNOWN",
            message: truncateMessage(item.snippet.textMessageDetails.messageText),
            publishedAt: item.snippet.publishedAt,
          }))
          .filter(message => {
            if (seenMessageIds.has(message.id))
            {
              return false;
            }

            seenMessageIds.add(message.id);
            return true;
          });

        if (incomingMessages.length > 0)
        {
          setChatMessages(previous => [
            ...previous,
            ...incomingMessages,
          ].slice(-MAX_CHAT_MESSAGES));
        }

        pageToken = data.nextPageToken ?? pageToken;
        setChatEnabled(true);
        setChatStatus("active");

        //YouTube determines the next permitted polling interval.
        const pollingInterval = data.pollingIntervalMillis ?? 5000;
        chatTimer = setTimeout(() => pollChat(pageToken), pollingInterval);
      }
      catch (err)
      {
        if ((disposed) || (err.name === "AbortError"))
        {
          return;
        }

        console.error("Live chat retrieval failed:", err);
        const terminalError = /liveChatEnded|liveChatDisabled|liveChatNotFound|quotaExceeded|dailyLimitExceeded/i.test(err.message);
        if (terminalError)
        {
          setChatEnabled(false);
          setChatStatus("disabled");
          return;
        }
        setChatStatus("error");
        chatTimer = setTimeout(() => pollChat(pageToken), CHAT_RETRY_INTERVAL_MS);
      }
    }

    //Initial discovery.
    discoveryBroadcast();

    return () =>
    {
        disposed = true;

        clearTimeout(discoveryTimer);
        clearTimeout(viewerTimer);
        clearTimeout(chatTimer);

        controller.abort();
    };
  }, [apiKey, channelId]);

  return { streamStatus, viewerCount, chatMessages, chatEnabled, chatStatus, error, };
};
