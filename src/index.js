import React from 'react';
import ReactDOM from 'react-dom';
import '@opentok/client';

import App from './App';
import './index.css';

function renderApp() {
  ReactDOM.render(
    <App/>, document.getElementById('root')
  );
}
renderApp();