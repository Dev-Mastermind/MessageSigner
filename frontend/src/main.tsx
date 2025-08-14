import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'

const DYNAMIC_ENVIRONMENT_ID =
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID ||
  '3ac1cd18-8219-4494-9192-f49614e0ac70'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        authModes: ['EmailOtp'],
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: (args: unknown) => console.log('Authentication successful:', args),
          onAuthError: (args: unknown) => console.error('Authentication error:', args),
        },
      }}
    >
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
)
