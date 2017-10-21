import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Timesheet from './views/Timesheet';
import AllStudents from './views/AllStudents';
import AllHours from './views/AllHours';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand><Link to=''>FRC 930 Dashboard</Link></Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1}><Link to='/students'>All Students</Link></NavItem>
            <NavItem eventKey={2}><Link to='/hours'>Hours</Link></NavItem>
          </Nav>
          
        </Navbar>
        <Route exact path="/" component={Timesheet}/>
        <Route path="/students" component={AllStudents} />
        <Route path="/hours" component={AllHours} />
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
