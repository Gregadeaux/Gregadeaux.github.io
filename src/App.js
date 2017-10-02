import React, { Component } from 'react'
import { Navbar, Nav, NavItem, Table, Button, Modal, Form, FormControl, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap'
import './App.css'
import io from 'socket.io-client';
import { ROOT_URL } from './Constants'

import { getTodaysStudents, signinStudent, signoutStudent, lateStudent, addStudent } from './api'
const socket = io(ROOT_URL);

class App extends Component {
  constructor() {
    super()
    this.state = {
      students: {},
      add_firstName: '',
      add_lastName: '',
      add_grade: '8',
      add_email: '',
      add_gender: 'male',
      submitted: false,
      showModal: false,
    }
  }

  componentDidMount() {
    this.updateStudents()

    socket.on('message', (json) => {
      let sArray = {...this.state.students}
      sArray[json.id] = json
      this.setState({students: sArray})
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>FRC 930 Dashboard</Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#">All Students</NavItem>
          </Nav>
        </Navbar>
        <div className="container">
          <Button bsStyle="primary" onClick={() => this.setState({showModal: true})}>Add Student</Button>
          <Table hover>
            <thead>
              <tr>
                <th>Current Students</th>
                <th>Grade</th>
                <th>Email</th>
                <th>Today's Attendance</th>
              </tr>
            </thead>
            <tbody>
              {this.renderStudents()}
            </tbody>
          </Table>
          {this.renderModal()}
        </div>
      </div>
    );
  }

  renderStudents() {
    return Object.keys(this.state.students).map((key) => {
      let student = this.state.students[key]
      let buttonStyle = "default"
      let buttonText = "Absent"

      if(student.date !== null) {
        if(!student.late) {
          buttonText = "On Time"
          buttonStyle = "success"
        }else {
          buttonText = "Late"
          buttonStyle = "warning"
        }
      }

      return (
        <tr key={student.id}>
          <td>{student.firstname} {student.lastname}</td>
          <td>{student.grade}</td>
          <td>{student.email}</td>
          <td>
            <Button bsStyle={buttonStyle} onClick={this.studentPressed.bind(this, student)}>{buttonText}</Button>
          </td>
        </tr>
      )
    })
  }

  renderModal() {
    if(this.state.showModal) {
      return (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Add Student</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup controlId="firstName" validationState={this.state.submitted && this.state.add_firstName.length === 0 ? 'error' : null}>
                    <ControlLabel>First name</ControlLabel>
                    <FormControl type="text" value={this.state.add_firstName} onChange={this.handleChange.bind(this, 'add_firstName')}/> 
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup controlId="lastName" validationState={this.state.submitted && this.state.add_lastName.length === 0 ? 'error' : null}>
                    <ControlLabel>Last name</ControlLabel>
                    <FormControl type="text" value={this.state.add_lastName} onChange={this.handleChange.bind(this, 'add_lastName')}/> 
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <FormGroup controlId="email" validationState={this.state.submitted && this.state.add_email.length === 0 ? 'error' : null}>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl type="text" value={this.state.add_email} onChange={this.handleChange.bind(this, 'add_email')}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup controlId="grade" validationState={this.state.submitted && this.state.add_grade.length === 0 ? 'error' : null}>
                    <ControlLabel>Grade</ControlLabel>
                    <FormControl componentClass="select" value={this.state.add_grade} onChange={this.handleChange.bind(this, 'add_grade')}>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </FormControl> 
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup controlId="gender" validationState={this.state.submitted && this.state.add_gender.length === 0 ? 'error' : null}>
                    <ControlLabel>Grade</ControlLabel>
                    <FormControl componentClass="select" value={this.state.add_gender} onChange={this.handleChange.bind(this, 'add_gender')}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </FormControl> 
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal.bind(this)}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.addStudent.bind(this)}>Add Student</Button>
          </Modal.Footer>
        </Modal.Dialog>
      )
    }
  }

  handleSubmit(event) {
    console.log("WOOHOO")
    event.preventDefault();
  }

  handleChange(key, event) {
    let newState = {}
    newState[key] = event.target.value

    this.setState(newState)
  }

  updateStudents() {
    getTodaysStudents().then((json) => {
      let students = {}
      json.forEach((s) => students[s.id] = s)
      this.setState({ students })
    })
  }

  closeModal() {
    this.setState({
          add_firstName: '',
          add_lastName: '',
          add_grade: '8',
          add_email: '',
          add_gender: 'male',
          submitted: false,
          showModal: false,
        })
  }

  addStudent() {
    if(this.state.add_firstName.length > 0 &&
      this.state.add_lastName.length > 0 &&
      this.state.add_email.length > 0 &&
      this.state.add_gender.length > 0 &&
      this.state.add_grade.length > 0) {
      let student = new URLSearchParams()

      student.append('firstname', this.state.add_firstName)
      student.append('lastname', this.state.add_lastName)
      student.append('email', this.state.add_email)
      student.append('gender', this.state.add_gender)
      student.append('grade', this.state.add_grade)

      addStudent(student).then((json) => {
        this.setState({
          add_firstName: '',
          add_lastName: '',
          add_grade: '8',
          add_email: '',
          add_gender: 'male',
          submitted: false,
          showModal: false,
        })
        this.updateStudents()
      })
    }else {
      this.setState({submitted: true})
    }
  }

  studentPressed(student) {
    let students = {...this.state.students}
    if(student.date === null) {
      students[student.id] = {...student, date: new Date().toString(), late: false, sid: student.id}
      this.setState({ students })

      signinStudent(student)
        .then((json) => {
          if(!json.error) {
            let sArray = {...this.state.students}
            sArray[student.id] = {...sArray[student.id], ...json}
            this.setState({students: sArray})
          }
        })
    }else if(!student.late) {
      students[student.id] = {...student, late: true}
      this.setState({ students })

      lateStudent(student)
        .then((json) => {
          if(!json.error) {
            let sArray = {...this.state.students}
            sArray[student.id] = {...sArray[student.id], ...json}
            this.setState({students: sArray})
          }
        })
    }else {
      students[student.id] = {...student, date: null, late: null, sid: null}
      this.setState({ students })

      signoutStudent(student)
        .then((json) => {
          if(!json.error) {
            let sArray = {...this.state.students}
            sArray[student.id] = {...sArray[student.id], ...json}
            this.setState({students: sArray})
          }
        })
    }
  }
}

export default App;
