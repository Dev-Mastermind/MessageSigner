import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { MessageSigner } from './components/MessageSigner'
import { MessageHistory } from './components/MessageHistory'
import { Header } from './components/Header'
import { LoginPrompt } from './components/LoginPrompt'

function App() {
  const { user } = useDynamicContext()
  const isAuthenticated = !!user

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!isAuthenticated ? (
          <LoginPrompt />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user?.email || 'User'}!
              </h1>
              <p className="text-gray-600">
                Sign messages with your embedded wallet, then verify them on chain
              </p>
            </div>
            <MessageSigner />
            <MessageHistory />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
