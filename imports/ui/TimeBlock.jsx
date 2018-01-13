// @flow
import React, { Component } from 'react';
import Task from './Task.jsx';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import { Typeahead} from 'react-bootstrap-typeahead';

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

  formatTime(time) {
    return time % 1 == 0 ? time + ":00" : parseInt(time) + ":30"
  }

  render() {
    return (
      <tr 
        key={this.props.x.time} 
        className={this.props.x.time == this.state.hour ? "selected" : ""}
        style={{border: "1px solid black"}}>
        <td> {this.formatTime(this.props.x.time)}: </td>
        {this.props.x.appointment ? (
          [
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
                Cancel
              </Button>
            </td>
          ]
        ) : (
          <td> 
            {this.props.editMode &&
                (
                  <Typeahead 
                    ref="project"
                    options = {this.props.projects}
                    allowNew = {true}
                    selectHintOnEnter = {true}
                    onChange={x => 
                      {
                        if (x[0].label) {
                          this.props.changeSchedule(x[0].label)
                        } else {
                          console.log(x)
                          this.props.changeSchedule(x[0])
                        }
                      }
                    }
                  />
                )
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
