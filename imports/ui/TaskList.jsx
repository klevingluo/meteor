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

  uncheckAll(tasks) {
    tasks.map(x =>{
      Meteor.call('tasks.setChecked', x._id, false);
    })
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

    let taskname = text
    let utility = 1
    let time = 1

    // h m l
    // u s e
    if (text[0] == '@') {
      const importance = text.substring(1,3);
      switch (importance) {
        case 'hu':
          utility = 21
          break;
        case 'hs':
          utility = 13
          break;
        case 'he':
          utility = 5
          break;
        case 'mu':
          utility = 13
          break;
        case 'ms':
          utility = 8
          break;
        case 'me':
          utility = 3
          break;
        case 'lu':
          utility = 8
          break;
        case 'ls':
          utility = 5
          break;
        case 'le':
          utility = 1
          break;
      }
      time = text.split(" ")[1]
      taskname = text.split(" ").slice(2).join(" ")
    }

    Meteor.call('tasks.insert', taskname, this.state.project[0], utility, time);

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


  renderTasks(filteredTasks) {

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

    return (
      <div className="container">
        <div className="jumbotron">
          <AccountsUIWrapper />
          <div>
            <button 
              className="delete btn btn-success" 
              onClick={this.uncheckAll.bind(this, filteredTasks)}>
              Uncheck All
            </button>
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
        <div> estimate completion: {date.toLocaleDateString()} </div>
      <form 
            id="project-input"
        className="change-project" onSubmit={() =>2}>
          <Typeahead 
            ref="projecter"
            allowNew = {true}
            ref={(ref) => this._typeahead = ref}
            options = {this.props.projects}
            onFocus = {() => this._typeahead.getInstance().clear()}
            selectHintOnEnter = {true}
            onChange = {x => {
              let projectName = x;
              if (x[0].label) {
                projectName = [x[0].label]
              }
              console.log(projectName);
              this.setState({
                project: projectName
              })
            }}
          />
        </form>
        { this.props.currentUser ?
            <form 
              className="new-task" 
              onSubmit={this.handleSubmit.bind(this)}
              id="task-input"
            >
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
        {this.renderTasks(filteredTasks)}
      </ul>
    </div>
    );
  }
}

export default withTracker(props => {
  Meteor.subscribe('tasks');
  const tasks = Tasks.find({}, {sort: {createdAt: 1}}).fetch();

  return {
    tasks: tasks,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
    schedule: props.schedule
  };
})(TaskList)
