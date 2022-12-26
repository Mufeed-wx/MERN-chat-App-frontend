import React from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import './MessageForm.css'

function messageForm() {
    const handleSubmit = ((e) => {
        e.preventDefault();
    })
    return (
        <>
            <div className='message-output'>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Your message'></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button type='submit' variant='primary' style={{ width: "100%", backgroundColor: "orange" }}>
                            <i className='fas fa-paper-plane'></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default messageForm