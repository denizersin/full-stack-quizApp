import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, TRPCClientErrorBase, httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import './index.css'
import { trpc } from './lib/trpc'
import Layout from '@/layout/index'
import Home from './pages/Home'
import { BrowserRouter } from 'react-router-dom';
import TrpcProvider from './components/Providers/TrpcProvider'
import SessionProvider from './components/Providers/SessionProvider'
import { ThemeProvider } from './components/Providers/ThemeProvider'

function App() {


  return (
    <BrowserRouter>
      <TrpcProvider>
        <SessionProvider>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </SessionProvider>
      </TrpcProvider>
    </BrowserRouter>

  )
}

export default App
