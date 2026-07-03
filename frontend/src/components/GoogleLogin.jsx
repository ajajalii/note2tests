
import React, { useEffect, useCallback, useId, useState } from 'react';
import { apiUrl } from '../lib/api';

export default function GoogleLogin({ onLoginSuccess, autoPrompt = false }) {
  const buttonId = useId().replace(/:/g, '');
  const [error, setError] = useState('');

  // Credential handler defined before useEffect
  const handleCredentialResponse = useCallback(async (response) => {
    const idToken = response.credential;
    setError('');

    try {
      const res = await fetch(apiUrl('/auth/google/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
      

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);

        localStorage.setItem('refresh_token', data.refresh);
        onLoginSuccess(data.user);
      } else {
        const message = await res.text();
        console.error('Google login failed:', message);
        setError('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      setError('Unable to reach the login server. Please try again.');
    }
  }, [onLoginSuccess]);

  useEffect(() => {
    const buttonEl = document.getElementById(buttonId);

    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: '794068868736-ndm7b7dqs5le977gb2uiidmhfh0phmvl.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        buttonEl,
        { theme: 'outline', size: 'large' }
      );

      if (autoPrompt) {
        window.google.accounts.id.prompt();
      }
    } else {
      console.warn('Google API not loaded yet.');
    }
  }, [handleCredentialResponse, autoPrompt, buttonId]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div id={buttonId}></div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
