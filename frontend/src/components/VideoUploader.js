import React from 'react';
import axios from 'axios';

const VideoUploader = ({ token }) => {
  const uploadVideo = async () => {
    const googleDriveUrl = prompt('Enter Google Drive video URL:');
    try {
      await axios.post(
        'https://video-management-server.vercel.app/upload',
        { googleDriveUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Video uploaded successfully');
    } catch (err) {
      alert('Error uploading video');
    }
  };

  return (
    <div>
      <button onClick={uploadVideo}>Upload Video</button>
    </div>
  );
};

export default VideoUploader;
