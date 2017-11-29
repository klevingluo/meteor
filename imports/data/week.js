import { moment } from 'meteor/momentjs:moment';

mon = []
tue =  [
  { time: 6.0,  task: "sleep" },
  { time: 6.5,  task: "sleep" },
  { time: 7.0,  task: "sleep" },
  { time: 7.5,  task: "sleep" },
  { time: 8.0,  task: "sleep" },
  { time: 8.5,  task: "morning routine" },
  { time: 9.0,  task: "morning routine" },
  { time: 9.5,  task: "get on campus" },
  { time: 10.0, priority: ['mapping'] },
  { time: 10.5, priority: ['mapping'] },
  { time: 11.0, priority: ['mapping'] },
  { time: 11.5, task: 'email chris paper'},
  { time: 12.0, task: 'prepare for meeting with chris amato'},
  { time: 12.5, priority: ['mapping'] },
  { time: 13.0, task: "meeting with chris amato"},
  { time: 13.5, task: "review meeting with chris amato"},
  { time: 14.0, priority: ['mapping']},
  { time: 14.5, priority: ['mapping']},
  { time: 15.0, priority: ['todo']},
  { time: 15.5, task: "robotics class" },
  { time: 16.0, task: "robotics class" },
  { time: 16.5, task: "robotics class" },
  { time: 17.0, priority: ['todo']},
  { time: 17.5, priority: ['bits']},
  { time: 18.0, task: 'get to cargurus, cambridge, 2 canal park, get there early and try to meet people, find out about deployment'},
  { time: 18.5, task: 'listen to tech talks'},
  { time: 19.0, task: 'listen to tech talks'},
  { time: 19.5, task: 'bike home'},
  { time: 20.0, priority: ['mapping']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, task: "evening routine"},
  { time: 21.5, task: "evening routine"},
];
wed = [
  { time: 6.0,  task: "sleep" },
  { time: 6.5,  task: "sleep" },
  { time: 7.0,  task: "sleep" },
  { time: 7.5,  task: "sleep" },
  { time: 8.0,  task: "sleep" },
  { time: 8.5,  task: "morning routine" },
  { time: 9.0,  task: "morning routine" },
  { time: 9.5,  task: "get on campus" },
  { time: 10.0, priority: ['mapping'] },
  { time: 10.5, priority: ['mapping'] },
  { time: 11.0, task: "amato group meeting"},
  { time: 11.5, task: "amato group meeting"},
  { time: 12.0, priority: ['mapping']},
  { time: 12.5, priority: ['mapping'] },
  { time: 13.0, priority: ['mapping']},
  { time: 13.5, priority: ['relax']},
  { time: 14.0, priority: ['mapping']},
  { time: 14.5, priority: ['mapping']},
  { time: 15.0, priority: ['todo']},
  { time: 15.5, priority: ['mapping']},
  { time: 16.0, priority: ['mapping']},
  { time: 16.5, priority: ['mapping']},
  { time: 17.0, priority: ['todo']},
  { time: 17.5, task: 'go home'},
  { time: 18.0, priority: ['mapping']},
  { time: 18.5, priority: ['mapping']},
  { time: 19.0, priority: ['todo']},
  { time: 19.5, priority: ['mapping']},
  { time: 20.0, priority: ['bits']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, task: "evening routine"},
  { time: 21.5, task: "evening routine"},
]
thu = []
fri = []
sat = []
sun = []

week = [sun, mon, tue, wed, thu, fri, sat]

oneoffs = [
  {
    date: '11/28/2017',
    start: 21.5,
    end: 22,
    task: 2
  },
  {
    date: '11/29/2017',
    start: 10,
    end: 11,
    task: 'office hours with yang'
  },
  {
    date: '11/29/2017',
    start: 18,
    end: 19,
    task: 'Preparing for the GRE'
  },
  {
    date: '11/30/2017',
    start: 18,
    end: 19,
    task: '3d printing workshop'
  }
]

Week = {
  tue: tue,
  getDay(date) {
    day = week[date.getDay()];
    dateString = date.toLocaleDateString().split('T')[0];
    console.log(dateString)
    appts = oneoffs.filter(x => x.date == dateString);
    for (i in appts) {
      for (j = appts[i].start; j < appts[i].end; j = 0.5 + j) {
        block = day.filter(x => x.time == j)[0];
        block.task = appts[i].task;
      }
    }
    return day;
  }
}

export {Week};
