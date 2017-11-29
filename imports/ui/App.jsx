import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Schedule from './Schedule.jsx';
import Task from './Task.jsx';
import TaskList from './TaskList.jsx';
import { FormControl, Button } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Col } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';

type Props = {
}

type State = {
}

// App component - represents the whole app
class App extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"
        />
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"
        />
        <Col sm={12} md={12} lg={6} xl={4}>
          <Schedule />
        </Col>
        <Col sm={12} md={12} lg={6} xl={4}>
          <TaskList />
        </Col>
        <Col sm={6} md={12} lg={6} xl={4}>
          <ul>
            <li>0.3: not nothing</li>
            <li>1: progress</li>
            <li>3: visible progress</li>
            <li>5: feedbackable</li>
            <li>8: milestone</li>
            <li>13: deliverable</li>
            <li>21: goal</li>
          </ul>
          <ul>
            <li>1: brainless</li>
            <li>2: minor effort</li>
            <li>4: will take research</li>
            <li>8: not sure how to proceed</li>
            <li>16: not sure where to start</li>
            <li>64: hard for an expert, and I'm not one</li>
            <li>128: hard for an expert, and I'm clueless</li>
          </ul>
        </Col>
      </div>
    );
  }
}

export default withTracker(props => {
  Meteor.subscribe('tasks');
  const tasks = Tasks.find({}, {sort: {createdAt: -1}}).fetch();

  return {
    tasks: tasks,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
  };
})(App)
