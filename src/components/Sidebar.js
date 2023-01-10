import React, { useContext, useEffect } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications,resetNotification } from '../features/userSlice';
import './sidebar.css'
function Sidebar() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
    const roomses = ['first room', "second room"]
    const { socket, rooms, setRooms, currentRooms, setCurrentRooms,
        members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg,
        newMessage, setNewMessages } = useContext(AppContext)
    function joinRoom(room,isPublic=true) {
        if (!user) {
            return alert('Please Login');
        }
        socket.emit('join-room', room,currentRooms)
        setCurrentRooms(room)
        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        //dispatch for notifications
        dispatch(resetNotification(room))
    }

    socket.off('notifications').on('notifications', (room) => {
        console.log(room, 'now  dfsd');
        if (currentRooms != room) dispatch(addNotifications(room)
        )})
    useEffect(() =>{
        if (user) {
            setCurrentRooms('general');
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user")
        }
       
    },[])
    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    })

    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data))
    }
    function handlePrivateMemberMsg(members) {
        setPrivateMemberMsg(members)
        const roomId = orderIds(user._id, members._id);
        joinRoom(roomId,false)
    }
    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 +"-"+id2
        } else {
            return id2+'-' +id1
        }
    }
    if (!user) {
        return <></>
    }
    return (
        <>
            <h2>Available roooms</h2>
            <ListGroup>
                {rooms.map((room, index) => (
                    
                    <ListGroup.Item key={index} style={{ cursor: "pointer", display: 'flex', justifyContent: 'space-between' }} active={room == currentRooms} onClick={() => joinRoom(room)}>
                        {room}{currentRooms !== room && <span className='badge rounded-pill bg-primary'>{user.newMessage[room] }</span>}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h2>Members</h2>
            <ListGroup>
                {members.map((members) => (
                    <ListGroup.Item key={members.id} style={{cursor:"pointer"}} active={privateMemberMsg?._id==members?._id} onClick={()=>handlePrivateMemberMsg(members)} disabled={members._id===user._id}>
                        <Row > 
                            <Col xs={2} className="members-status">
                                <img src={members.picture} className="members-status-img" />
                                {members.status=="online" ?<i className='fas fa-circle sidebar-online-status'></i>:<i className='fas fa-circle sidebar-offline-status'></i>}
                            </Col>
                            <Col xs={9}>
                                {members.name}
                                {members._id === user?._id && " (You)"}
                                {members.status == "offline" && "(offline)"}
                                {currentRooms !== members && <span className='badge rounded-pill bg-primary'>{members.newMessage[members] }</span>}
                            </Col>
                       </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
}

export default Sidebar