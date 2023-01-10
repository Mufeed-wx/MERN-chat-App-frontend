import React from 'react'
import { Nav, NavDropdown, Navbar, Container, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutUserMutation } from '../services/appApi';
import logo from '../assets/Logo.png'

function Navigation() {
  const user = useSelector((state) => state.user)
  const [logoutUser] = useLogoutUserMutation();
  const handleLogout = async(e) => {
    e.preventDefault();
    await logoutUser(user)
    //redirect to home page
    window.location.replace("/")
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <img src={logo} style={{ width: 50, height: 50 }} />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user &&
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>}
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            <Nav.Link href="#link">Link</Nav.Link>
            {user &&
              <NavDropdown title={
                <>
                  <img src={user.picture} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginRight: 10 }} />
                  {user.name}
                </>
              } id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation