import React from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { Wallet, LogOut, Shield } from 'lucide-react'

const shortAddr = (addr?: string) => {
  if (!addr) return 'Unknown'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export const Header: React.FC = () => {
  const { isAuthenticated, user, handleLogOut, primaryWallet } = useDynamicContext() as unknown as {
    isAuthenticated: boolean;
    user: any;
    handleLogOut: any;
    primaryWallet: any;
  };
  const logoutAndReload = async () => {
    try {
      if (typeof handleLogOut === 'function') {
        await handleLogOut()
      } else {
        console.warn('handleLogOut not available on useDynamicContext()')
      }
    } catch (e) {
      console.error('Logout error', e)
    } finally {
      window.location.reload()
    }
  }

  return (
<header className="bg-white border-b border-gray-200">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">

      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Web3 Message Signer
          </h1>
          <p className="text-sm text-gray-500">
            Sign and Verify Messages
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Wallet className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.email ? user.email : shortAddr(primaryWallet?.address)}
            </span>
          </div>
        )}

        <button
          onClick={logoutAndReload}
          className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</header>
  )
}
