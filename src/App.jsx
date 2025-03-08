import { useState } from 'react'

import { LoginSignup } from './LoginSignup/LoginSignup'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginSignup/>
    </>
  )
}

export default App
