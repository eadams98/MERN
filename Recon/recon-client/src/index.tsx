import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './State/index';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const persistConfig= {
  key: 'persist-key',
  storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({ reducer: persistedReducer })
const persistor = persistStore(store)

root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <PersistGate persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
