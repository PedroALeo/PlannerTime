import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'
import { store } from './store/store.ts'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position='top-right' richColors />
      <App />
    </Provider>
  </StrictMode>
)
