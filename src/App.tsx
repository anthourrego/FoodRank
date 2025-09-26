import './App.css'
import { AppRouter } from './router/AppRouter'
import { Toaster } from 'sonner'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {

  // Create a client
  const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    }
  )


  return (
    <>
     <QueryClientProvider client={queryClient}>

        <AppRouter/>
        <Toaster expand={true} position="bottom-center"/>
     </QueryClientProvider>
    </>
  )
}

export default App
