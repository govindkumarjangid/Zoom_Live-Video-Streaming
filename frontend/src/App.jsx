import { Routes, Route } from 'react-router-dom'
import HeroSection from './pages/HeroSection'
import Authentication from './pages/Authentication'
import { Toaster } from 'react-hot-toast'
import VideoMeet from './pages/VideoMeet'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/meeting" element={<VideoMeet />} />
      </Routes>


      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </>
  )
}

export default App