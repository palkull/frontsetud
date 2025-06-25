import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Loginpage from './pages/login.jsx'


export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Loginpage />} />
      </Routes>
    </BrowserRouter>
    
  )
}