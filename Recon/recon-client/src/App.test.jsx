import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import rootReducer from './State/index';

const testStore = configureStore({ reducer: rootReducer });

test('renders login shell', () => {
  render(
    <Provider store={testStore}>
      <App />
    </Provider>
  );
  expect(screen.getByText(/RECON/i)).toBeInTheDocument();
});
