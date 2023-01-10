import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Chat from './pages/chat/Chat';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket } from './context/appContext'

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRooms, setCurrentRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessage, setNewMessages] = useState({});

  const user = useSelector((state) => state.user)
  return (
    <AppContext.Provider value={{
      socket, rooms, setRooms, currentRooms, setCurrentRooms,
      members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg,
      newMessage, setNewMessages
    }} >
      <BrowserRouter>
        <Navigation />
        <Routes>
          {!user && (
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </>
          )}
          <Route path="/" element={<Home />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
