'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // import PersistGate
import { store, persistor } from '../redux/store'; // import persistor too

export default function ReduxProviderWrapper({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
