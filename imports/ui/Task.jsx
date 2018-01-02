// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Form, FormControl, Button } from 'react-bootstrap';
import type { taskT } from './Schedule.jsx';

type Props = {
  task: taskT,
  selected: boolean
}

export default class Task extends Component<Props> {

  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  setUtility() {
    const ref = ReactDOM.findDOMNode(this.refs[this.props.task._id + "utility"])
    let value = ref && ref.value ? ref.value.trim() : 0
    Meteor.call('tasks.setUtility', this.props.task._id, Number(value));
  }

  setTime() {
    const ref = ReactDOM.findDOMNode(this.refs[this.props.task._id + "time"])
    let value = ref && ref.value ? ref.value.trim() : 0
    Meteor.call('tasks.setTime', this.props.task._id, Number(value));
  }

  setProject() {
    const value = 
      ReactDOM.findDOMNode(this.refs[this.props.task._id + "project"]).value.trim();
    Meteor.call('tasks.setProject', this.props.task._id, value);
  }

  render() {

    const leverage = 
      (this.props.task.utility / this.props.task.time).toString().substring(0,4);

    // style differently based on whether or not is checked
    // const since we don't change it
    let taskClassName = this.props.task.checked ? 'checked' : '';
    taskClassName += this.props.selected ? ' selected' : '';

    return (
      <li className={taskClassName}>
        <button 
          className="delete btn btn-danger" 
          onClick={this.deleteThisTask.bind(this)}>
          X
        </button>

        <Form inline>
          <FormControl
            type="checkbox"
            readOnly
            checked={this.props.task.checked}
            onClick={this.toggleChecked.bind(this)}
          />
          <FormControl
            className="inline"
            bsSize="sm"
            type="text"
            style={{width: '50px'}}
            ref={this.props.task._id + "utility"}
            placeholder={this.props.task.utility}
            onChange={this.setUtility.bind(this)}
          />
          /
          <FormControl
            className="inline"
            type="text"
            bsSize="sm"
            style={{width: '50px'}}
            ref={this.props.task._id + "time"}
            placeholder={this.props.task.time}
            onChange={this.setTime.bind(this)}
          />
          proj:
          <FormControl
            className="inline"
            type="text"
            bsSize="sm"
            style={{width: '100px'}}
            ref={this.props.task._id + "project"}
            placeholder={this.props.task.project}
            onChange={this.setProject.bind(this)}
          />
          { this.props.showPrivateButton ? (
            <Button 
              bsSize="sm"
              onClick={this.togglePrivate.bind(this)}
            >
              {this.props.task.private ? 'Private' : 'Public' }
            </Button>
          ) : '' }

          <strong> lev: </strong>
          <span className="text"> {leverage} </span>
        </Form>

        <br/>
        <strong> {this.props.task.username} </strong>:
        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}
