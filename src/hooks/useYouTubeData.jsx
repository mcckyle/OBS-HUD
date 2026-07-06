//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 5 July 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import React, { useState, useEffect } from 'react';

const MAX_LENGTH = 72;

export function useYouTubeData() {
  const [subscriberCount, setSubscriberCount] = useState('---');
  const [latestSubscriber, setLatestSubscriber] = useState({ id: 'init', text: 'SCANNING FREQUENCIES...'});

  useEffect(() => {
    let isMounted = true;

    //Read secure keys straight from the local OBS browser souce URL string...
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('key');
    const channelId = urlParams.get('channelId');

    //If variables are truly missing, stop execution.
    if ((!apiKey) || (!channelId))
    {
        console.warn('Missing YouTube configuration keys in URL parameters.');
        return;
    }

    const fetchYouTubeMetrics = async () => {
      try
      {
        //1. Fetch Subscriber Count
        const statsUrl = 'https://www.googleapis.com/' + 'youtube' + '/v3/channels?part=statistics&id=' + channelId + '&key=' + apiKey;
        const statsResponse = await fetch(statsUrl);

        if (!statsResponse.ok)
        {
            throw new Error(`Stats HTTP error! status: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        if ((statsData.items) && (statsData.items.length > 0) && (isMounted))
        {
          const count = statsData.items[0].statistics.subscriberCount;

          //Format to nicely readable string e.g. "1,250".
          setSubscriberCount(parseInt(count).toLocaleString());
        }

        //1. Fetch Latest Video Comment.
        const commsUrl = 'https://www.googleapis.com/' + 'youtube' + '/v3/commentThreads?part=snippet&allThreadsRelatedToChannelId=' + channelId + '&maxResults=1&key=' + apiKey;

        const commsResponse = await fetch(commsUrl);
        if (commsResponse.ok)
        {
          const commsData = await commsResponse.json();

          if ((commsData.items) && (commsData.items.length > 0) && (isMounted))
          {
            const commentSnippet = commsData.items[0].snippet.topLevelComment.snippet;
            const author = commentSnippet.authorDisplayName;
            const textContent = commentSnippet.textDisplay;
            const truncated = textContent.length > MAX_LENGTH ? `${textContent.slice(0, MAX_LENGTH)}…` : textContent;

            //Format to nicely readable string e.g. "1,250".
            setLatestSubscriber({
              id: commsData.items[0].id,
              text: `COMMS • ${author.toUpperCase()} • ${truncated.toUpperCase()}`
            });
          }
          else if (isMounted)
          {
            setLatestSubscriber({ id: 'empty', text: 'NO INBOUND TRANSMISSIONS' });
          }
        }
      }
      catch (error)
      {
        console.error('Error fetching data from YouTube API:', error);
        if (isMounted)
        {
          setLatestSubscriber({ id: 'error', text: 'DATA LINK CORRUPTED' });
        }
      }
    };

    //Initial load when stream starts...
    fetchYouTubeMetrics();

    //Poll YouTube once every 2 minutes (YouTube API limits daily quotes, so avoid heavy spamming).
    const pollInterval = setInterval(fetchYouTubeMetrics, 120000);

    return () => {
        isMounted = false;
        clearInterval(pollInterval);
    };
  }, []);

  return { subscriberCount, latestSubscriber };
};
