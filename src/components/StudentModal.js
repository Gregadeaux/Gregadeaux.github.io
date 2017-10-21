import React, { Component } from 'react'
import { Button, Modal, Form, FormControl, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap'

export default class StudentModal extends Component {
	constructor() {
		super()
	    this.state = {
	      modal: {
	        firstname: '',
	        lastname: '',
	        email: '',
	        grade: 8,
	        gender: 'male'
	      },
	      submitted: false,     
	    }
	}

	componentDidMount() {
		if(this.props.student) this.setState({modal: this.props.student})
	}

	render() {
		console.log(this.state)
		return (
			<Modal.Dialog>
	          <Modal.Header>
	            <Modal.Title>Add Student</Modal.Title>
	          </Modal.Header>
	          <Modal.Body>
	            <Form onSubmit={this.handleSubmit}>
	              <Row>
	                <Col xs={12} md={6}>
	                  <FormGroup controlId="firstName" validationState={this.state.submitted && this.state.modal.firstname.length === 0 ? 'error' : null}>
	                    <ControlLabel>First name</ControlLabel>
	                    <FormControl type="text" value={this.state.modal.firstname} onChange={this.handleChange.bind(this, 'firstname')}/> 
	                  </FormGroup>
	                </Col>
	                <Col xs={12} md={6}>
	                  <FormGroup controlId="lastName" validationState={this.state.submitted && this.state.modal.lastname.length === 0 ? 'error' : null}>
	                    <ControlLabel>Last name</ControlLabel>
	                    <FormControl type="text" value={this.state.modal.lastname} onChange={this.handleChange.bind(this, 'lastname')}/> 
	                  </FormGroup>
	                </Col>
	              </Row>
	              <Row>
	                <Col xs={12} md={12}>
	                  <FormGroup controlId="email">
	                    <ControlLabel>Email</ControlLabel>
	                    <FormControl type="text" value={this.state.modal.email} onChange={this.handleChange.bind(this, 'email')}/>
	                  </FormGroup>
	                </Col>
	              </Row>
	              <Row>
	                <Col xs={12} md={6}>
	                  <FormGroup controlId="grade" validationState={this.state.submitted && this.state.modal.grade.length === 0 ? 'error' : null}>
	                    <ControlLabel>Grade</ControlLabel>
	                    <FormControl componentClass="select" value={this.state.modal.grade} onChange={this.handleChange.bind(this, 'grade')}>
	                      <option value="8">8th Grade</option>
	                      <option value="9">9th Grade</option>
	                      <option value="10">10th Grade</option>
	                      <option value="11">11th Grade</option>
	                      <option value="12">12th Grade</option>
	                    </FormControl> 
	                  </FormGroup>
	                </Col>
	                <Col xs={12} md={6}>
	                  <FormGroup controlId="gender" validationState={this.state.submitted && this.state.modal.gender.length === 0 ? 'error' : null}>
	                    <ControlLabel>Grade</ControlLabel>
	                    <FormControl componentClass="select" value={this.state.modal.gender} onChange={this.handleChange.bind(this, 'gender')}>
	                      <option value="male">Male</option>
	                      <option value="female">Female</option>
	                    </FormControl> 
	                  </FormGroup>
	                </Col>
	              </Row>
	            </Form>
	          </Modal.Body>
	          <Modal.Footer>
	            <Button onClick={this.cancel.bind(this)}>{this.props.cancelText}</Button>
	            <Button bsStyle="primary" onClick={this.submit.bind(this)}>{this.props.submitText}</Button>
	          </Modal.Footer>
	        </Modal.Dialog>
		)
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	handleChange(key, event) {
		let newState = {...this.state.modal}
		newState[key] = event.target.value

		this.setState({modal: newState})
	}

	clearFields() {
		this.setState({
          modal: {
            firstname: '',
            lastname: '',
            email: '',
            grade: 8,
            gender: 'male'
          },
          submitted: false,
          showModal: false,
      	})
	}

	submit() {
		this.clearFields()
		if(this.props.submit) this.props.submit(this.state.modal)
	}

	cancel() {
		this.clearFields()
		if(this.props.cancel) this.props.cancel()
	}

}
