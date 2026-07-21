//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 20 July 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import React, { useState, useEffect } from 'react';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const MAX_COMMENT_LENGTH = 72;
const POLL_INTERVAL_MS = 120000;
const STATUS = {
  CONNECTING: "CONNECTING...",
  EMPTY: "NO RECENT TRANSMISSIONS",
  ERROR: "SIGNAL LOST"
};
const DEFAULT_MESSAGES = {
  connecting: {
    id: "connecting",
    author: "",
    message: STATUS.CONNECTING
  },
  empty: {
    id: "empty",
    author: "",
    message: STATUS.EMPTY
  },
  error: {
    id: "error",
    author: "",
    message: STATUS.ERROR
  }
};

export function useYouTubeData()
{
  const [subscriberCount, setSubscriberCount] = useState('---');
  const [latestMessage, setLatestMessage] = useState(DEFAULT_MESSAGES.connecting);

  useEffect(() =>
  {
    let isMounted = true;

    //Read secure keys straight from the local OBS browser souce URL string...
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('key');
    const channelId = urlParams.get('channelId');
    const statsUrl = `${YOUTUBE_API}/channels?part=statistics&id=` + channelId + '&key=' + apiKey;
    const commsUrl = `${YOUTUBE_API}/commentThreads?part=snippet&allThreadsRelatedToChannelId=` + channelId + '&maxResults=1&key=' + apiKey;

    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
        console.warn('Missing YouTube configuration keys in URL parameters.');
        return;
    }

    const fetchYouTubeMetrics = async () =>
    {
      try
      {
        //1. Parse Subscriber Count.
        const [statsResponse, commsResponse] = await Promise.all([fetch(statsUrl), fetch(commsUrl)]);

        if (!statsResponse.ok)
        {
            throw new Error(`Stats HTTP error! status: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        if ((statsData.items) && (statsData.items.length > 0) && (isMounted))
        {
          const count = statsData.items[0].statistics.subscriberCount;

          //Format to nicely readable string e.g. "1,250".
          setSubscriberCount(Number(count).toLocaleString("en-US"));
        }

        //2. Parse Latest Video Comment.
        if (commsResponse.ok)
        {
          const commsData = await commsResponse.json();

          if ((commsData.items) && (commsData.items.length > 0) && (isMounted))
          {
            const commentSnippet = commsData.items[0].snippet.topLevelComment.snippet;
            const author = commentSnippet.authorDisplayName;
            const textContent = commentSnippet.textDisplay;
            const truncated = textContent.length > MAX_COMMENT_LENGTH ? `${textContent.slice(0, MAX_COMMENT_LENGTH).trimEnd()}…` : textContent;

            //Format to nicely readable string e.g. "1,250".
            setLatestMessage({
              id: commsData.items[0].id,
              author: author,
              message: truncated
            });
          }
          else if (isMounted)
          {
            setLatestMessage(DEFAULT_MESSAGES.empty);
          }
        }
      }
      catch (error)
      {
        console.error('Error fetching data from YouTube API:', error);
        if (isMounted)
        {
          setLatestMessage(DEFAULT_MESSAGES.error);
        }
      }
    };

    //Initial load when stream starts...
    fetchYouTubeMetrics();

    //Poll YouTube once every 2 minutes.
    const pollInterval = setInterval(fetchYouTubeMetrics, POLL_INTERVAL_MS);

    return () => {
        isMounted = false;
        clearInterval(pollInterval);
    };
  }, []);

  return { subscriberCount, latestMessage };
};
