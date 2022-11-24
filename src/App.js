import './App.css';
import StateProvider from './stateContainer/stateContainer';
import RouteList from './routes';

import store from './store'
import { Provider } from 'react-redux'
import {  BrowserRouter } from "react-router-dom";
import GameStateProvider from './providers/gameStatusProvider';
import { Auth0Provider } from '@auth0/auth0-react';

function App() {
  return (
    <div className="App">
      <StateProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Auth0Provider
              domain= {process.env.REACT_APP_AUTH_0_DOMAIN}
              clientId= {process.env.REACT_APP_AUTH_0_CLIENT_ID}
              redirectUri={window.location.origin}
            >
              <GameStateProvider>
                <RouteList />
              </GameStateProvider>
            </Auth0Provider>
          </BrowserRouter>
        </Provider>
      </StateProvider>
    </div>
  );
}

export default App;
