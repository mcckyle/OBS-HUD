//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 22 July 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import React, { useState, useEffect } from 'react';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const MAX_COMMENT_LENGTH = 72;
const POLL_INTERVAL_MS = 2 * 60 * 1000;
const DEFAULT_MESSAGES = Object.freeze({
  connecting: {
    id: "connecting",
    author: "",
    message: "CONNECTING..."
  },
  empty: {
    id: "empty",
    author: "",
    message: "NO RECENT TRANSMISSIONS"
  },
  error: {
    id: "error",
    author: "",
    message: "SIGNAL LOST"
  },
  config: {
    id: "config",
    author: "",
    message: "MISSING CONFIGURATION"
  },
});

export function useYouTubeData()
{
  const [subscriberCount, setSubscriberCount] = useState("---");
  const [latestMessage, setLatestMessage] = useState(DEFAULT_MESSAGES.connecting);

  useEffect(() =>
  {
    const controller = new AbortController();
    const requestOptions = {
      signal: controller.signal,
    };

    //Read API credentials from the Browser Souce URL.
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('key');
    const channelId = urlParams.get('channelId');
    const statsUrl = `${YOUTUBE_API}/channels?part=statistics&id=` + channelId + '&key=' + apiKey;
    const commsUrl = `${YOUTUBE_API}/commentThreads?part=snippet&allThreadsRelatedToChannelId=` + channelId + '&maxResults=1&key=' + apiKey;

    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
        console.warn('Missing YouTube configuration keys in URL parameters.');
        setLatestMessage(DEFAULT_MESSAGES.config);
        return;
    }

    const fetchYouTubeMetrics = async () =>
    {
      try
      {
        //1. Fetch subscriber statistics.
        const [statsResponse, commsResponse] = await Promise.all([fetch(statsUrl, requestOptions), fetch(commsUrl, requestOptions)]);

        if (!statsResponse.ok)
        {
            throw new Error(`Stats HTTP error! status: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        const subscriberCount = statsData.items?.[0]?.statistics?.subscriberCount;

        if (subscriberCount)
        {
          //Format to nicely readable string e.g. "1,250".
          setSubscriberCount(Number(subscriberCount).toLocaleString("en-US"));
        }

        //2. Fetch latest channel comment.
        if (commsResponse.ok)
        {
          const commsData = await commsResponse.json();
          const comment = commsData.items?.[0]?.snippet?.topLevelComment?.snippet;

          if (comment)
          {
            const { authorDisplayName, textDisplay } = comment;
            const truncated = textDisplay.length > MAX_COMMENT_LENGTH ? `${textDisplay.slice(0, MAX_COMMENT_LENGTH).trimEnd()}…` : textDisplay;

            //Format to nicely readable string e.g. "1,250".
            setLatestMessage({
              id: commsData.items[0].id,
              author: authorDisplayName,
              message: truncated
            });
          }
          else
          {
            setLatestMessage(DEFAULT_MESSAGES.empty);
          }
        }
      }
      catch (error)
      {
        if (error.name === "AbortError")
        {
          return;
        }

        console.error('Error fetching data from YouTube API:', error);
        setLatestMessage(DEFAULT_MESSAGES.error);
      }
    };

    //Initial fetch.
    fetchYouTubeMetrics();

    //Poll YouTube once every 2 minutes.
    const pollInterval = setInterval(fetchYouTubeMetrics, POLL_INTERVAL_MS);

    return () =>
    {
        controller.abort();
        clearInterval(pollInterval);
    };
  }, []);

  return { subscriberCount, latestMessage };
};
