import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Task from './Task.jsx';
import { Meteor } from 'meteor/meteor';
import { NavDropdown, MenuItem, FormControl, Button } from 'react-bootstrap';
import { Typeahead} from 'react-bootstrap-typeahead';
import { Tasks } from '../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';

type Props = {
  tasks: object[]
}

type State = {
  hideCompleted: boolean,
  estimate: boolean,
  selectedItem: number,
  project: string[],
}

// TaskList component - represents the whole app
class TaskList extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      estimate: false,
      selectedItem: 0,
      project: []
    };
  }

  handleKey(e) {
    window.onkeyup = e => {
      switch(e.key) {
        case 'j':
          this.setState({
            selectedItem: Math.min(
              this.props.tasks.length-2, 
              this.state.selectedItem + 1
            )
          });
          break;
        case 'k':
          this.setState({
            selectedItem: Math.max(0, this.state.selectedItem - 1)
          });
          break;
        case ' ':
          ReactDOM.findDOMNode(this.refs.textInput).focus()
          break;
        default:
          console.log(e.key);
      }
    }
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  toggleEstimate() {
    this.setState({
      estimate: !this.state.estimate,
    });
  }

  changeProject(eventKey) {
    if (this.state.project.includes(eventKey)) {
      this.setState({
        project: this.state.project.filter(x => x != eventKey)
      });
    } else {
      this.state.project.splice(0, 0, eventKey);
      this.setState({
        project: this.state.project
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the react ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text, this.state.project[0]);

    // clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    this.setState({
      estimate: true
    });
  }

  getLeverage(task) {
    if (task.checked) {
      return -1;
    } else if (!task.utility || !task.time) {
      if (this.state.estimate) {
        return 9999
      }
      return 0;
    } else {
      return task.utility/task.time;
    }
  }


  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (this.state.project.length) {
      filteredTasks = filteredTasks.filter(
        task => this.state.project.includes(task.project));
    } else if (this.props.project) {
      filteredTasks = filteredTasks.filter(
        task => this.props.project.includes(task.project));
    }

    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    filteredTasks.sort((a,b) => {
      leva = this.getLeverage(a) 
      levb = this.getLeverage(b) 
      if (leva > levb) {
        return -1;
      } else if (levb > leva) {
        return 1
      }
      return 0
    });

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task 
          key={task._id} 
          task={task} 
          selected={
            Number.isInteger(this.state.selectedItem) && 
            filteredTasks[this.state.selectedItem]._id == task._id
          }
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderSelect() {

    let options = []
    this.props.projects.forEach( x => options.push(
      <MenuItem key={x} eventKey={x}> {x} </MenuItem>
    ))

    return (
      <span>
        {this.state.project.map(x => (
          <Button 
            key={x}
            onClick={() => this.changeProject(x)}
          > 
            {x}
          </Button>
        ))}
      </span>
    );
  }

  render() {
    let proj_time = this.props.tasks
      .filter(x => {
        return x.project == this.state.project[0]
      })
      .map(x => (x.time || 0))
      .reduce( (a,b) => a+b, 0);

    let date = new Date()
    let count = 0

    while (proj_time > 0 && count < 100) {
      new_day = new Date(date.setDate(date.getDate() + 1))
      day=this.props.schedule[new_day] || []
      proj_time -= day.filter(x => {
        return !x.task && x.priority && x.priority.includes(this.state.project[0])
      }).length;
      count++;
    }

    return (
      <div className="container">
        <div className="jumbotron">
          <AccountsUIWrapper />
          <div>
            <label className="hide-completed">
              <FormControl
                bsSize="small"
                type="checkbox"
                readOnly
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
            </label>
            <label className="estimate">
              <FormControl
                bsSize="small"
                type="checkbox"
                readOnly
                checked={this.state.estimate}
                onClick={this.toggleEstimate.bind(this)}
              />
              Estimate Mode
            </label>
          </div>
        { this.renderSelect() }
        <div> estimate completion: {date.toLocaleDateString()} </div>
        <Typeahead 
          ref="projecter"
          options = {this.props.projects}
          selectHintOnEnter = {true}
          onChange = {x => {
            this.setState({
              project: x
            })
          }}
        />
        { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <FormControl
                className="inline"
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
        }
      </div>
      <ul>
        {this.renderTasks()}
      </ul>
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
    schedule: props.schedule
  };
})(TaskList)
