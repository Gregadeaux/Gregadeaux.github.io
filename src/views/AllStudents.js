import React, { Component } from 'react'
import { Table, Button, Modal, Form, FormControl, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap'

import StudentModal from '../components/StudentModal'
import { getTodaysStudents, addStudent, updateStudent } from '../api'

export default class AllStudents extends Component {
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
    getTodaysStudents().then((json) => {
        let students = {}
        json.forEach((s) => students[s.id] = s)
        this.setState({ students })
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
    )
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
        <tr key={student.id} onClick={this.showStudent.bind(this, student)}>
          <td>{student.firstname} {student.lastname}</td>
          <td>{student.grade}</td>
          <td>{student.email}</td>
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
}