import { Outlet } from 'react-router'
import './App.css'
import { MobileNavBar } from './components/Navbar'

function App() {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default App
