import React from 'react'
import ReactDOM from 'react-dom/client'

import { HashRouter } from 'react-router-dom'

import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Use HashRouter instead of BrowserRouter in order to deploy on github pages */}
    {/* cf. https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/ */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
