import './App.css'
import { AppRouter } from './router/AppRouter'
import { Toaster } from 'sonner'

function App() {

  return (
    <>
      <AppRouter/>
      <Toaster expand={true} position="bottom-center"/>
    </>
  )
}

export default App
