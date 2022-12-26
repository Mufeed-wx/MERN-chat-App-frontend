import React from 'react'
import { ListGroup } from 'react-bootstrap'

function sidebar() {
    const rooms = ['first room', 'second room', 'third room'];
  return (
      <>
          <h2>Available roooms</h2>
          <ListGroup>
              {rooms.map((item, index) => (
                  <ListGroup.Item key={index}>{ item}</ListGroup.Item>
              ))}
          </ListGroup>
      </>
  )
}

export default sidebar