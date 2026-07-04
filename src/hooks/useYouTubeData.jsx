//Filename: useYouTubeData.jsx
//Author: Kyle McColgan
//Date: 3 July 2026
//Description: This file contains the YouTube API integration for the OBS HUD project.

import React, { useState, useEffect } from 'react';

export function useYouTubeData() {
  const [subscriberCount, setSubscriberCount] = useState('---');
  const [latestSubscriber, setLatestSubscriber] = useState({ id: 'init', text: 'SYSTEM ONLINE '});

  //Read secure keys straight from the local OBS browser souce URL string...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('key');
    const channelId = urlParams.get('channelId');

    if ((!apiKey) || (!channelId))
    {
        console.warn('Missing YouTube configuration keys in URL parameters.');
        return;
    }

    const fetchYouTubeMetrics = async () => {
      try
      {
        //Fetch channel metrics (Subscriber Count).
        const response = await fetch(`https://googleapis.com{channelId}&key=${apiKey}`);

        const data = await response.json();
        if ((data.items) && (data.items.length > 0))
        {
          const count = data.items[0].statistics.subscriberCount;

          //Format to nicely readable string e.g. "1,250".
          setSubscriberCount(parseInt(count).toLocaleString());
        }
      }
      catch (error)
      {
        console.error('Error fetching data from YouTube API:', error);
      }
    };

    //Initial load when stream starts...
    fetchYouTubeMetrics();

    //Poll YouTube once every 2 minutes (YouTube API limits daily quotes, so avoid heavy spamming).
    const pollInterval = setInterval(fetchYouTubeMetrics, 120000);

    return () => clearInterval(pollInterval);
  }, []);

  return { subscriberCount, latestSubscriber };
};
