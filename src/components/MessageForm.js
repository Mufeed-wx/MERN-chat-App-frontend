import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import './MessageForm.css'
import { AppContext } from "../context/appContext";

function MessageForm() {
    const user = useSelector((state) => state.user);
    const [message, setMessage] = useState('');
    const messageEndRef = useRef(null);
    const { socket, currentRooms, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    
    useEffect(() => {
        scrollToBottom();
    }, [message])
    
    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({behavior:"smooth"})
    }
    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();

        let month = date.getMonth().toString();
        month = month + 1;
        month = month.length > 1 ? month : "0" + month;
        console.log('month........',month);
        let day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }
    const todayDate = getFormattedDate();
    socket.off("room-messages").on("room-messages", (roomMessages) => {
        console.log('messages',roomMessages);
        setMessages(roomMessages)
        console.log(messages,'sc');
    })

    const handleSubmit = ((e) => {
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const room = currentRooms;
        socket.emit("message-room", room, message, user, time, todayDate)
        setMessage('')
    })

    return (
        <>
            <div className='message-output'>
                {user && !privateMemberMsg?._id && <div className='alert alert-info'>You are in the {currentRooms}</div>}
                {user && privateMemberMsg?._id &&(
                    <>
                        <div className='alert alert-info conversation-info'>
                            <div>
                                Your conversation with {privateMemberMsg.name} <img src={ privateMemberMsg.picture} className='conversation-profile-pic' />
                            </div>
                        </div>
                    </>
                )}
                {!user && <div className='alert alert-danger'>Please login</div>}
                {messages.map(({ _id: date,messsagesBydate },idx) => (
                    <div key={idx}>
                        <p className='alert alert-info text-center message-date-indicator'>
                            {date}
                        </p>
                        {messsagesBydate.map(({content,time,from:sender},Msgidx) => (
                            <div className={sender?.email==user?.email?"message":"incoming-message"} key={Msgidx}>
                                <div className='message-inner'>
                                    <div className='d-flex align-items-center mb-3'>
                                        <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                                        <p className='message-sender'>{ sender._id==user?._id?"You":sender.name}</p>
                                    </div>
                                    <p className='message-content'>{content}</p>
                                    <p className='message-timestamp-left'>{time}</p>
                               </div>
                          </div>
                      ))}
                   </div>
                ))}
                <div ref={messageEndRef}/>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control style={{height:"25px"}} type='text' placeholder='Your message' value={message} onChange={(e)=>setMessage(e.target.value)} disabled={!user}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button type='submit' variant='primary' style={{ width: "100%", backgroundColor: "orange" }} disabled={!user}>
                            <i className='fas fa-paper-plane'></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default MessageForm