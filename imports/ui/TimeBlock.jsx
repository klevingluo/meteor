// @flow
import React, { Component } from 'react';
import Task from './Task.jsx';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';

export type TimeBlockType = {
  time: number,
  task: TaskType,
  project?: string,
  appointment?: any //AppointmentType
}

type TaskType = {
  project: string,
  text: string
}

type Props = {
  x: TimeBlockType
}

export default class TimeBlock extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      hour: this.props.hour
    };
  }

  removeAppointment(id) {
    Meteor.call('appointments.remove', id);
  }

  removeTask(id) {
    Meteor.call('tasks.remove', id);
  }

  render() {
    return (
      <tr 
        key={this.props.x.time} 
        className={this.props.x.time == this.state.hour ? "selected" : ""}
        style={{border: "1px solid black"}}>
        <td> {this.props.x.time}: </td>
        {this.props.x.appointment ? (
          <td> 
            <span>
              <b>[appointment]</b> {this.props.x.appointment.text}
            </span>
            <Button
              className="delete btn btn-danger" 
              bsSize="xsmall"
              onClick={
                this.removeAppointment.bind(this, this.props.x.appointment._id)
              }>
              X
            </Button>
          </td>
        ) : (
          <td> 
            {this.props.editMode &&
                (<DropdownButton 
                  title="load project"
                  activeKey={"not"}
                  ref="project" 
                  id="project"
                  name={"this"}
                  onSelect={x => 2}
                >
                  {
                    this.props.projects.map(x => (
                      <MenuItem key={x} eventKey={x}> {x} </MenuItem>
                    ))
                  }
                </DropdownButton>)
            }
            <b>[{this.props.x.task.project}]</b> {this.props.x.task.text} 
          </td>
        )}
        {this.props.x.task && this.props.x.task._id ? (
          <td>
            <Button
              className="delete btn btn-info" 
              bsSize="xsmall"
              onClick={
                this.removeTask.bind(this, this.props.x.task._id)
              }>
              done
            </Button>
          </td>
        ) : (
          <td>
          </td>
        )}
      </tr>
    );
  } 
}
