/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './pages/Home'
import About from './pages/About'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import './style/app.css'
import { Stack, Typography } from '@mui/joy'

function App() {

  const [profile, setProfile] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className='page'>
    <Navbar className='nav'>
        <Container>
          
          <Navbar.Brand style={{color:'white'}} ><Stack direction={'row'}><Typography level='h1' style={{color:"white"}}>Stats</Typography><Typography style={{color:"rgb(29,185,84)"}}>ify</Typography></Stack></Navbar.Brand>
          <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            {loggedIn == false
              ? <Button className='btn-success' href='https://maxschultenfinal-6072d8e4ce91.herokuapp.com/login' target='_blank'>Login</Button> : <></>
            }
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <BrowserRouter>
       <Routes>
        <Route index element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/about' element={<About />}/>
       </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
