import { Routes, Route } from 'react-router-dom'
import HeroSection from './pages/HeroSection'
import Authentication from './pages/Authentication'
import { Toaster } from 'react-hot-toast'
import VideoMeet from './pages/VideoMeet'
import Home from './pages/Home'
import History from './pages/History'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/:url" element={<VideoMeet />} />
      </Routes>


      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </>
  )
}

export default App