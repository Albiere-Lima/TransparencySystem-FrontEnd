import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const GOOGLE_CLIENT_ID = '198297483621-5oourgcegn53o2hvlrpgqhnkba5nb65g.apps.googleusercontent.com';
console.log(window.location.origin)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);