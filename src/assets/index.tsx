import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';

import './css/_var.pcss';
import './css/_base.pcss';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js' );
  });
}
