import React, { useState } from 'react';
import Auth from './components/Auth';
import VideoUploader from './components/VideoUploader';
import VideoList from './components/VideoList';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  return (
    <div>
      {!user ? (
        <Auth setUser={setUser} setToken={setToken} />
      ) : (
        <>
          <h1>Welcome, {user.username}</h1>
          <VideoUploader token={token} />
          <VideoList token={token} />
        </>
      )}
    </div>
  );
};

export default App;
