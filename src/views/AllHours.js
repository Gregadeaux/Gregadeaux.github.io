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
      startOfWeek: moment().startOf('week')
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
      <div className="container">
        <Table hover bordered>
          <thead>
            <tr>
              <th></th>
              <th><Button onClick={this.subtractWeek.bind(this)}><Glyphicon glyph="menu-left" /></Button></th>
              <th className="cell">{this.state.startOfWeek.format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(1, 'day').format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(2, 'day').format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(3, 'day').format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(4, 'day').format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(5, 'day').format('ddd MMM Do')}</th>
              <th className="cell">{this.state.startOfWeek.clone().add(6, 'day').format('ddd MMM Do')}</th>
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
          <td className="name-cell">{`${s.firstname} ${s.lastname}`}</td>
          {this.renderHoursForStudent(s)}
        </tr>
      )
    })
  }

  renderHoursForStudent(student) {
    if(this.state.hours[student.id]) {
      let rows = [<td key={999}></td>]
      for(let i = 0; i < 7; i++) {
        let date = this.state.startOfWeek.clone().add(i, 'day')
        let hour = this.state.hours[student.id][date.format('ddd MMM Do')]

        if(hour && hour.late) rows.push(<td key={i} className='cell late'>Late</td>)
        else if(hour) rows.push(<td key={i} className='cell here'>Here</td>)
        else rows.push(<td key={i} className='cell'></td>)
      }

      rows.push(<td key={8}></td>)
      return rows
    } else {
      return [
        <td key={0}></td>,
        <td key={1} className='cell'></td>,
        <td key={2} className='cell'></td>,
        <td key={3} className='cell'></td>,
        <td key={4} className='cell'></td>,
        <td key={5} className='cell'></td>,
        <td key={6} className='cell'></td>,
        <td key={7} className='cell'></td>,
        <td key={8}></td>
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