import React, { Component } from 'react'
import { Table, Button, Modal, Form, FormControl, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap'
import '../styles/Timesheet.css'
import io from 'socket.io-client';
import { ROOT_URL } from '../Constants'

import StudentModal from '../components/StudentModal'

import { getTodaysStudents, signinStudent, signoutStudent, lateStudent, addStudent, updateStudent } from '../api'
const socket = io(ROOT_URL);

class Timesheet extends Component {
  constructor() {
    super()
    this.state = {
      students: {},
      showModal: false,
      showUpdateModal: false,
      currentStudent: null,
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
          {this.renderUpdateModel()}
        </div>
      </div>
    );
  }

  renderStudents() {
    let students = Object.keys(this.state.students)

    students.sort((s1, s2) => {
      var nameA = this.state.students[s1].firstname.toUpperCase()
      var nameB = this.state.students[s2].firstname.toUpperCase()
      if (nameA < nameB) { return -1 }
      if (nameA > nameB) { return 1 }
      return 0
    })

    return students.map((key) => {
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
          <td onClick={this.showStudent.bind(this, student)}>{student.firstname} {student.lastname}</td>
          <td onClick={this.showStudent.bind(this, student)}>{student.grade}</td>
          <td onClick={this.showStudent.bind(this, student)}>{student.email}</td>
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
        <StudentModal 
          submitText="Add Student"
          cancelText="Cancel"
          submit={this.addStudent.bind(this)}
          cancel={this.closeModal.bind(this)}/>
      )
    }
  }

  renderUpdateModel() {
    if(this.state.showUpdateModal) {
      return (
        <StudentModal 
          submitText="Update"
          cancelText="Close"
          student={this.state.currentStudent}
          cancel={this.closeModal.bind(this)}
          submit={this.updateStudent.bind(this)}/>
      )
    }
  }

  showStudent(student) {
    this.setState({
      showUpdateModal: true,
      currentStudent: student
    })
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
      modal: {
        firstname: '',
        lastname: '',
        email: '',
        grade: 8,
        gender: 'male'
      },
      currentStudent: null,
      submitted: false,
      showModal: false,
      showUpdateModal: false,
    })
  }

  addStudent(studentMap) {
    if(studentMap.firstname.length > 0 &&
      studentMap.lastname.length > 0 &&
      studentMap.gender.length > 0 &&
      studentMap.grade.length > 0) {
      let student = new URLSearchParams()

      student.append('firstname', studentMap.firstname)
      student.append('lastname', studentMap.lastname)
      student.append('email', studentMap.email)
      student.append('gender', studentMap.gender)
      student.append('grade', studentMap.grade)

      addStudent(student).then((json) => {
        this.setState({
          showModal: false,
        })
        this.updateStudents()
      })
    }
  }

  updateStudent(studentMap) {
    if(studentMap.firstname.length > 0 &&
      studentMap.lastname.length > 0 &&
      studentMap.gender.length > 0 &&
      studentMap.grade.length > 0) {
      let student = new URLSearchParams()

      student.append('firstname', studentMap.firstname)
      student.append('lastname', studentMap.lastname)
      student.append('email', studentMap.email)
      student.append('gender', studentMap.gender)
      student.append('grade', studentMap.grade)

      updateStudent(studentMap.id, student).then((json) => {
        this.setState({
          showUpdateModal: false,
          currentStudent: null
        })
        this.updateStudents()
      })
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

export default Timesheet;
