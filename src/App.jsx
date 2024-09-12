import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/header/Header'
import About from './components/home/About'
import Masthead from './components/home/Masthead'
import Projects from './components/home/Projects'
import Experience from './components/home/Experience'
import Divider from './components/divider/Divider'
import { TabProvider } from './components/home/TabContext';
import Certifications from './components/home/Certifications'
import Footer from './components/footer/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TabProvider>
        <Header/>
        <Masthead/>
        <About/>
        <Divider text="Projects"/>
        <Projects/>
        <Divider text="Experience"/>
        <Experience/>
        <Divider text='Certifications'/>
        <Certifications/>
        <Footer/>
      </TabProvider>
    </>
  )
}

export default App
