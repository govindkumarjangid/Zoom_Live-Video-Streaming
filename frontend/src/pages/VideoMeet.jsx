import { Video, VideoOff, Mic, MicOff, PhoneOff, MonitorUp, MonitorOff, MessageSquare, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import io from "socket.io-client";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const server_url = 'http://localhost:5000';

var connections = {};

const peerConfigConnections = {
  "iceServers": [
    { "urls": "stun:stun.l.google.com:19302" }
  ]
}


const VideoMeet = () => {

  const navigate = useNavigate();


  const { toastStyle } = useAuth();

  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoref = useRef();
  const videoRef = useRef([])

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState(true);
  let [audio, setAudio] = useState(true);


  let [screen, setScreen] = useState();
  let [screenAvailable, setScreenAvailable] = useState(false);

  let [showModal, setModal] = useState(true);


  let [messages, setMessages] = useState([])
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(3);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");


  let [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("HELLO")
    getPermissions();
  }, [])

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => { })
          .catch((e) => console.log(e))
      }
    }
  }

  const getPermissions = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });

      if (userMediaStream) {
        setVideoAvailable(true);
        setAudioAvailable(true);
        setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

        window.localStream = userMediaStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.log("Error accessing media devices.", error);
      // Fallback: in case they only have audio or only video, handle graceful degradation
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setVideoAvailable(false);
        setAudioAvailable(true);
        window.localStream = fallbackStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = fallbackStream;
        }
      } catch (err) {
        console.log("No media devices available.", err);
      }
    }
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();

  }

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach(track => track.stop())
    } catch (e) { console.log(e) }

    window.localStream = stream
    localVideoref.current.srcObject = stream

    for (let id in connections) {
      if (id === socketIdRef.current) continue

        window.localStream.getTracks().forEach(track => {
          let sender = connections[id].getSenders().find(s => s.track && s.track.kind === track.kind)
          if (sender) {
            sender.replaceTrack(track)
          } else {
            connections[id].addTrack(track, window.localStream)
          }
        })

      connections[id].createOffer().then((description) => {
        console.log(description)
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
          })
          .catch(e => console.log(e))
      })
    }

    stream.getTracks().forEach(track => track.onended = () => {
      setVideo(false);
      setAudio(false);

      try {
        let tracks = localVideoref.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      } catch (e) { console.log(e) }

      let blackSilence = (...args) => new MediaStream([black(...args), silence()])
      window.localStream = blackSilence()
      localVideoref.current.srcObject = window.localStream

      for (let id in connections) {
        window.localStream.getTracks().forEach(track => {
          let sender = connections[id].getSenders().find(s => s.track && s.track.kind === track.kind)
          if (sender) {
            sender.replaceTrack(track)
          } else {
            connections[id].addTrack(track, window.localStream)
          }
        } )

        connections[id].createOffer().then((description) => {
          connections[id].setLocalDescription(description)
            .then(() => {
              socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
            })
            .catch(e => console.log(e))
        })
      }
    })
  }

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({
        video: video ? { facingMode: "user" } : false,
        audio: audio ? true : false
      })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e))
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      } catch (e) { }
    }
  }

  let getDislayMediaSuccess = (stream) => {
    console.log("HERE")
    try {
      window.localStream.getTracks().forEach(track => track.stop())
    } catch (e) { console.log(e) }

    window.localStream = stream
    localVideoref.current.srcObject = stream

    for (let id in connections) {
      if (id === socketIdRef.current) continue

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
          })
          .catch(e => console.log(e))
      })
    }

    stream.getTracks().forEach(track => track.onended = () => {
      setScreen(false)

      try {
        let tracks = localVideoref.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      } catch (e) { console.log(e) }

      let blackSilence = (...args) => new MediaStream([black(...args), silence()])
      window.localStream = blackSilence()
      localVideoref.current.srcObject = window.localStream

      getUserMedia()

    })
  }

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message)

    if (fromId !== socketIdRef.current) {
      // Create connection if we haven't seen this user yet somehow
      if (connections[fromId] === undefined) return;

      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === 'offer') {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
              }).catch(e => console.log(e))
            }).catch(e => console.log(e))
          }
        }).catch(e => console.log(e))
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
      }
    }
  }

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false })

    socketRef.current.on('signal', gotMessageFromServer)

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href)
      socketIdRef.current = socketRef.current.id

      socketRef.current.on('chat-message', addMessage)

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id))
      })

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          if (connections[socketListId] === undefined && socketListId !== socketIdRef.current) {
            connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

            // Wait for their ice candidate
            connections[socketListId].onicecandidate = function (event) {
              if (event.candidate != null) {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
              }
            }

            // Wait for their video stream (modern browsers use ontrack)
            connections[socketListId].ontrack = (event) => {
              console.log("BEFORE:", videoRef.current);
              console.log("FINDING ID: ", socketListId);

              let stream = event.streams[0]; // Extract the remote stream

              let videoExists = videoRef.current.find(video => video.socketId === socketListId);

              if (videoExists) {
                console.log("FOUND EXISTING");
                // Update the stream of the existing video
                setVideos(videos => {
                  const updatedVideos = videos.map(video =>
                    video.socketId === socketListId ? { ...video, stream: stream } : video
                  );
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
              } else {
                console.log("CREATING NEW");
                let newVideo = {
                  socketId: socketListId,
                  stream: stream,
                  autoplay: true,
                  playsinline: true
                };

                // Synchronous update to prevent second track from bypassing the check
                videoRef.current = [...videoRef.current, newVideo];

                setVideos(videos => {
                  if (videos.some(video => video.socketId === socketListId)) {
                     // In case React batched and already added it, just update the stream
                     const updatedVideos = videos.map(video =>
                      video.socketId === socketListId ? { ...video, stream: stream } : video
                     );
                     videoRef.current = updatedVideos;
                     return updatedVideos;
                  }

                  const updatedVideos = [...videos, newVideo];
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
              }
            };

            // Add the local video stream using modern addTrack
            if (window.localStream !== undefined && window.localStream !== null) {
              window.localStream.getTracks().forEach(track => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            } else {
              let blackSilence = (...args) => new MediaStream([black(...args), silence()])
              window.localStream = blackSilence()
              window.localStream.getTracks().forEach(track => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            }
          }
        })

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                })
                .catch(e => console.log(e))
            })
          }
        }
      })
    })
  }

  let silence = () => {
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator()
    let dst = oscillator.connect(ctx.createMediaStreamDestination())
    oscillator.start()
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height })
    canvas.getContext('2d').fillRect(0, 0, width, height)
    let stream = canvas.captureStream()
    return Object.assign(stream.getVideoTracks()[0], { enabled: false })
  }

  // Instead of renegotiating on video/audio toggle, simply enable/disable the tracks
  let handleVideo = () => {
    if (window.localStream !== undefined && window.localStream !== null) {
      window.localStream.getVideoTracks().forEach(track => track.enabled = !video);
    }
    setVideo(!video);
  }

  let handleAudio = () => {
    if (window.localStream !== undefined && window.localStream !== null) {
      window.localStream.getAudioTracks().forEach(track => track.enabled = !audio);
    }
    setAudio(!audio)
  }

  useEffect(() => {
    if (screen !== undefined) {
      if (screen) {
        getDislayMedia();
      } else {
        // Revert back directly forcing the front-facing webcam
        navigator.mediaDevices.getUserMedia({
          video: videoAvailable ? { facingMode: "user" } : false,
          audio: audioAvailable
        })
          .then((stream) => {
            getDislayMediaSuccess(stream) // Send original stream to everyone
          })
          .catch((e) => console.log(e))
      }
    }
  }, [screen])

  let handleScreen = () => {
    setScreen(!screen);
  }

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    } catch (e) { }
     navigate('/home');
  }

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  }
  let closeChat = () => {
    setModal(false);
  }
  let handleMessage = (e) => {
    setMessage(e.target.value);
  }

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data }
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };



  let sendMessage = () => {
    if (message === "") {
      toast.error("Please enter a message", toastStyle);
      return;
    }
    console.log("SENDING MESSAGE: ", message, " FROM USER: ", username);
    console.log("SOCKET: ", socketRef.current);
    socketRef.current.emit('chat-message', message, username)
    setMessage("");

    // this.setState({ message: "", sender: username })
  }


  let connect = () => {
    setAskForUsername(false);
    getMedia();
  }



  return (
    <div>
      {

        askForUsername ? (
          <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#050308] text-white relative overflow-hidden">


            <div className="z-10 w-full max-w-md bg-[#120e1a]/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_40px_rgba(242,126,32,0.1)] border border-white/10">
              <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-[#f27e20]">
                Enter into Lobby
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-500 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full bg-[#050308] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"
                    />
                  </div>
                </div>

                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative shadow-inner">
                  <video
                    ref={localVideoref}
                    autoPlay
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">Camera Preview</div>
                </div>

                <button
                  type="button"
                  onClick={connect}
                  className="w-full bg-[#f27e20] hover:bg-[#d96c16] text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-200 focus:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Connect & Join
                </button>

              </div>
            </div>

          </div>
        ) : (

          <div className="h-screen w-full bg-[#050308] text-white flex flex-col relative overflow-hidden">

            {/* Main Video Area */}
            <div className="flex-1 flex w-full relative">
              {/* Conference View */}

              <div className={`p-4 flex-1 grid gap-4 transition-all duration-300 ${showModal ? 'w-full md:w-[calc(100%-350px)]' : 'w-full'} auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>

                <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10">
                  <video
                    className="w-full h-full object-cover transform scale-x-[-1]"
                    ref={(ref) => {
                      localVideoref.current = ref;
                      if (ref && window.localStream) {
                        ref.srcObject = window.localStream;
                      }
                    }}
                    autoPlay
                    muted
                  ></video>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-medium">You</div>
                </div>

                {videos.map((video) => (
                  <div key={video.socketId} className="relative bg-black rounded-2xl overflow-hidden border border-white/10">
                    <video
                      className="w-full h-full object-cover"
                      data-socket={video.socketId}
                      ref={ref => {
                        if (ref && video.stream) {
                          ref.srcObject = video.stream;
                        }
                      }}
                      autoPlay
                    >
                    </video>
                  </div>
                ))}

              </div>

              {/* Chat Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: showModal ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full md:w-87.5 bg-[#120e1a]/95 md:bg-[#120e1a]/90 backdrop-blur-xl border-l border-white/10 flex flex-col h-full absolute right-0 top-0 z-30 shadow-2xl"
              >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Chat</h2>
                    <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length !== 0 ? messages.map((item, index) => (
                      <div className="bg-white/5 p-3 rounded-lg" key={index}>
                        <p className="text-xs text-orange-400 font-bold mb-1">{item.sender}</p>
                        <p className="text-sm text-gray-200">{item.data}</p>
                      </div>
                    )) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No Messages Yet</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/10 bg-[#050308]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={handleMessage}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors text-white"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-[#f27e20] hover:bg-[#d96c16] text-white p-3 rounded-lg transition-colors flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                </motion.div>


            </div>

            {/* Bottom Controls */}
            <div className="h-auto py-4 min-h-20 bg-[#120e1a]/80 backdrop-blur-xl border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 relative z-20">
              <button
                onClick={handleAudio}
                className={`p-3 rounded-full transition-colors flex items-center justify-center border cursor-pointer ${audio ? 'bg-white/10 hover:bg-white/20 border-white/10' : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-500'}`}
              >
                {audio ? <Mic size={24} /> : <MicOff size={24} />}
              </button>

              <button
                onClick={handleVideo}
                className={`p-3 rounded-full transition-colors flex items-center justify-center border cursor-pointer ${video ? 'bg-white/10 hover:bg-white/20 border-white/10' : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-500'}`}
              >
                {video ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              {screenAvailable && (
                <button
                  onClick={handleScreen}
                  className={`p-3 rounded-full transition-colors flex items-center justify-center border cursor-pointer ${screen ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-400' : 'bg-white/10 hover:bg-white/20 border-white/10'}`}
                >
                  {screen ? <MonitorOff size={24} /> : <MonitorUp size={24} />}
                </button>
              )}

              <button
                onClick={handleEndCall}
                className="p-3 mx-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
              >
                <PhoneOff size={24} />
              </button>

              <div className="relative ml-auto sm:ml-0">
                <button
                  onClick={showModal ? closeChat : openChat}
                  className={`p-3 rounded-full transition-colors flex items-center justify-center border cursor-pointer ${showModal ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/10 hover:bg-white/20 border-white/10'}`}
                >
                  <MessageSquare size={24} />
                  {newMessages > 0 && !showModal && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-[#120e1a]">
                      {newMessages > 99 ? '99+' : newMessages}
                    </span>
                  )}
                </button>
              </div>


            </div>


          </div>

        )
      }
    </div>
  )
}

export default VideoMeet;