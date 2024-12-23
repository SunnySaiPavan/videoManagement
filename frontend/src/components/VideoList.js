import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoList = ({ token }) => {
  const [videos, setVideos] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/videos', {
        headers: { Authorization: `Bearer ${token}` },
        params: { title: titleFilter },
      });
      setVideos(res.data);
    } catch (err) {
      alert('Error fetching videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [titleFilter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by title"
        value={titleFilter}
        onChange={(e) => setTitleFilter(e.target.value)}
      />
      <div>
        {videos.map((video) => (
          <div key={video.id}>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <video src={video.url} controls width="600"></video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
