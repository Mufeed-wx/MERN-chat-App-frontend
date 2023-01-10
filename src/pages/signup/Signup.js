import React, { useState } from 'react'
import { Col, Container } from 'react-bootstrap'
import './signup.css'
import { Form, Row, Button } from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom'
import imgpro from '../../assets/profile.png'
import { useSignupUserMutation } from '../../services/appApi'


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();

  //image upload status
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgPrevie, setImgPreview] = useState(null);

  function validateimg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert('max file size is 1mb');
    } else {
      setImage(file);
      setImgPreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = (async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ltu8fuaj")
    try {
      setUploadingImg(true);
      let res = await fetch('http://api.cloudinary.com/v1_1/djyun9jad/image/upload', {
        method: 'post',
        body: data
      })
      const urlData = await res.json();
      setUploadingImg(false)
      return urlData.url
    } catch (error) {
      setUploadingImg(false)
      console.log('error')
    }
  })


  const handleSignup = (async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload your profile picture');
    const url = await uploadImage(image);
    console.log(url);
    //signup the user
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate('/chat')
      }
    })
  })
  return (
    <Container>
      <Row>

        <Col md={7} className="d-flex flex-direction-column align-items-center justify-content-center">
          <Form style={{ width: "50%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h3 className='text-center'>Create account</h3>
            <div className='signup-profile-pic_container'>
              <img src={imgPrevie || imgpro} className='signup-profile-pic' />
              <label htmlFor='image-upload' className='image-upload-label'>
                <i className='fas fa-plus-circle add-picture-icon'></i>
              </label>
              <input type='file' id='image-upload' hidden accept='image/png image/jpeg' onChange={validateimg} />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="name" placeholder="Your Name" onChange={(e)=>setName(e.target.value)} value={name} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)} value={email} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
            </Form.Group>
            <Button variant="primary" type="submit" className='signup-button'>
              {uploadingImg ? 'Signing you up..':'Signup'}
            </Button>
            <div className='py-3'>
              <p className='text-center'>
                Already have an account ? <Link to='/login'>Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className='signup__bg'></Col>
      </Row>
    </Container>
  )
}

export default Signup