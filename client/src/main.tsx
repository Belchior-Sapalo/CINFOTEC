import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import Home from './pages/Home.tsx'
import Auth from './pages/Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
      </Route>
    </Routes>
  </BrowserRouter>,
)
