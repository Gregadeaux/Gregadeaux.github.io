import React, { Component } from 'react'
import { Table, Col, Row, Button, Glyphicon } from 'react-bootstrap'
import moment from 'moment'
import '../styles/AllHours.css'

import { getAllSignins, getTodaysStudents } from '../api'

export default class AllHours extends Component {
  constructor() {
    super()
    this.state = {
      hours: {},
      students: [],
      startOfWeek: moment().startOf('week'),
      endOfWeek: moment().endOf('week')
    }
  }

  componentDidMount() {
    getAllSignins().then((json) => {
      let hours = {}

      json.forEach((h) => {
        if(!hours[h.id]) hours[h.id] = {}
        hours[h.id][moment(h.date).format('ddd MMM Do')] = h
      })

      this.setState({ hours })
    })

    getTodaysStudents().then((students) => {
      this.setState({ students })
    })
  }

  render() {
    return (
      <div class="container">
        <Table hover>
          <thead>
            <tr>
              <th></th>
              <th><Button onClick={this.subtractWeek.bind(this)}><Glyphicon glyph="menu-left" /></Button></th>
              <th>{this.state.startOfWeek.format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(1, 'day').format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(2, 'day').format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(3, 'day').format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(4, 'day').format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(5, 'day').format('ddd MMM Do')}</th>
              <th>{this.state.startOfWeek.clone().add(6, 'day').format('ddd MMM Do')}</th>
              <th><Button onClick={this.addWeek.bind(this)}><Glyphicon glyph="menu-right" /></Button></th>
            </tr>
          </thead>
          <tbody>
            {this.renderStudents()}
          </tbody>
        </Table>
      </div>
    )
  }

  renderStudents() {
    return this.state.students.map((s) => {
      return (
        <tr key={s.id}>
          <td>{`${s.firstname} ${s.lastname}`}</td>
          {this.renderHoursForStudent(s)}
        </tr>
      )
    })
  }

  renderHoursForStudent(student) {
    if(this.state.hours[student.id]) {
      let rows = [<td></td>]
      console.log(this.state.hours[student.id])
      for(let i = 0; i < 7; i++) {
        let date = this.state.startOfWeek.clone().add(i, 'day')
        let hour = this.state.hours[student.id][date.format('ddd MMM Do')]
        console.log(date)

        if(hour && hour.late) rows.push(<td class='late'>Late</td>)
        else if(hour) rows.push(<td class='here'>Here</td>)
        else rows.push(<td></td>)
      }

      rows.push(<td></td>)
      return rows
    } else {
      return [
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>,
        <td></td>
      ]
    }
  }

  subtractWeek() {
    this.setState({ startOfWeek: this.state.startOfWeek.clone().subtract(1, 'week')})
  }

  addWeek() {
    this.setState({ startOfWeek: this.state.startOfWeek.clone().add(1, 'week')})
  }
}