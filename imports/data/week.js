import { moment } from 'meteor/momentjs:moment';
import { Appointments } from '../api/appointments.js';
import { ScheduleTemplate } from '../api/schedule.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

mon = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['morning routine'] },
  { time: 6.5,  priority: ['morning routine'] },
  { time: 7.0,  priority: ['commute']},
  { time: 7.5,  priority: ['compost']},
  { time: 8.0,  priority: ['compost']},
  { time: 8.5,  priority: ['compost']},
  { time: 9.0,  priority: ['tooling']},
  { time: 9.5,  priority: ['networking']},
  { time: 10.0, priority: ['curator'] },
  { time: 10.5, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.0, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.5, priority: ["Rings and Fields @ 302 Kariotis"]},
  { time: 12.0, priority: ["Rings and Fields @ 302 Kariotis"]},
  { time: 12.5, priority: ['Rings and Fields @ 302 Kariotis'] },
  { time: 13.0, priority: ['Rings and Fields @ 302 Kariotis']},
  { time: 13.5, priority: ['ai']},
  { time: 14.0, priority: ['ai']},
  { time: 14.5, priority: ['']},
  { time: 15.0, priority: ['']},
  { time: 15.5, priority: ['']},
  { time: 16.0, priority: ['']},
  { time: 16.5, priority: ['commute']},
  { time: 17.0, priority: ['tooling']},
  { time: 17.5, priority: ['citizenship']},
  { time: 18.0, priority: ['relax']},
  { time: 18.5, priority: ['relax']},
  { time: 19.0, priority: ['baxter']},
  { time: 19.5, priority: ['bits']},
  { time: 20.0, priority: ['bike club @ 126 ryder hall']},
  { time: 20.5, priority: ['bike club @ 126 ryder hall']},
  { time: 21.0, priority: ['evening routine']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['sleep']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
];
tue = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['morning routine'] },
  { time: 6.5,  priority: ['morning routine'] },
  { time: 7.0,  priority: ['misc']},
  { time: 7.5,  priority: ['relax']},
  { time: 8.0,  priority: ['compost']},
  { time: 8.5,  priority: ['compost']},
  { time: 9.0,  priority: ['tooling']},
  { time: 9.5,  priority: ['networking']},
  { time: 10.0, priority: ['compilers'] },
  { time: 10.5, priority: ['compilers'] },
  { time: 11.0, priority: ['compilers'] },
  { time: 11.5, priority: ['Compilers @ shillman 210']},
  { time: 12.0, priority: ['Compilers @ shillman 210']},
  { time: 12.5, priority: ['Compilers @ shillman 210'] },
  { time: 13.0, priority: ['Compilers @ shillman 210']},
  { time: 13.5, priority: ['Topology @ Stetson East 020']},
  { time: 14.0, priority: ['Topology @ Stetson East 020']},
  { time: 14.5, priority: ['Topology @ Stetson East 020']},
  { time: 15.0, priority: ['Topology @ Stetson East 020']},
  { time: 15.5, priority: ['compost']},
  { time: 16.0, priority: ['compost']},
  { time: 16.5, priority: ['commute']},
  { time: 17.0, priority: ['commute']},
  { time: 17.5, priority: ['dinner']},
  { time: 18.0, priority: ['dinner']},
  { time: 18.5, priority: ['compost']},
  { time: 19.0, priority: ['bits and bots meeting']},
  { time: 19.5, priority: ['bits and bots meeting']},
  { time: 20.0, priority: ['guitar']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['evening routine']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['sleep']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
];
wed = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['morning routine'] },
  { time: 6.5,  priority: ['morning routine'] },
  { time: 7.0,  priority: ['misc']},
  { time: 7.5,  priority: ['socializing']},
  { time: 8.0,  priority: ['compost']},
  { time: 8.5,  priority: ['compost']},
  { time: 9.0,  priority: ['compilers']},
  { time: 9.5,  priority: ['compilers']},
  { time: 10.0, priority: ['compilers'] },
  { time: 10.5, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.0, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.5, priority: ['Public Speaking @ Ryder 207']},
  { time: 12.0, priority: ['Public Speaking @ Ryder 207']},
  { time: 12.5, priority: ['Public Speaking @ Ryder 207']},
  { time: 13.0, priority: ['Public Speaking @ Ryder 207']},
  { time: 13.5, priority: ['ai']},
  { time: 14.0, priority: ['misc']},
  { time: 14.5, priority: ['']},
  { time: 15.0, priority: ['']},
  { time: 15.5, priority: ['']},
  { time: 16.0, priority: ['']},
  { time: 16.5, priority: ['curator']},
  { time: 17.0, priority: ['curator']},
  { time: 17.5, priority: ['bits']},
  { time: 18.0, priority: ['compost']},
  { time: 18.5, priority: ['relax']},
  { time: 19.0, priority: ['relax']},
  { time: 19.5, priority: ['guitar']},
  { time: 20.0, priority: ['guitar']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['mapping']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['evening routine']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
];
thu = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['morning routine'] },
  { time: 6.5,  priority: ['morning routine'] },
  { time: 7.0,  priority: ['misc']},
  { time: 7.5,  priority: ['socializing']},
  { time: 8.0,  priority: ['compost']},
  { time: 8.5,  priority: ['compost']},
  { time: 9.0,  priority: ['networking']},
  { time: 9.5,  priority: ['compilers']},
  { time: 10.0, priority: ['misc'] },
  { time: 10.5, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.0, priority: ['Religion and Modernity @ Snell 125'] },
  { time: 11.5, priority: ['Rings and Fields @ 302 Kariotis']},
  { time: 12.0, priority: ['Rings and Fields @ 302 Kariotis']},
  { time: 12.5, priority: ['Rings and Fields @ 302 Kariotis'] },
  { time: 13.0, priority: ['Rings and Fields @ 302 Kariotis']},
  { time: 13.5, priority: ['misc']},
  { time: 14.0, priority: ['compilers']},
  { time: 14.5, priority: ['Compilers @ shillman 210']},
  { time: 15.0, priority: ['Compilers @ shillman 210']},
  { time: 15.5, priority: ['Compilers @ shillman 210']},
  { time: 16.0, priority: ['Compilers @ shillman 210']},
  { time: 16.5, priority: ['misc']},
  { time: 17.0, priority: ['curator']},
  { time: 17.5, priority: ['bits']},
  { time: 18.0, priority: ['citizenship']},
  { time: 18.5, priority: ['compost']},
  { time: 19.0, priority: ['math club']},
  { time: 19.5, priority: ['math club']},
  { time: 20.0, priority: ['commute']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['guitar']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['evening routine']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
];
fri = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['morning routine'] },
  { time: 6.5,  priority: ['morning routine'] },
  { time: 7.0,  priority: ['misc']},
  { time: 7.5,  priority: ['socializing']},
  { time: 8.0,  priority: ['compost']},
  { time: 8.5,  priority: ['compost']},
  { time: 9.0,  priority: ['compost']},
  { time: 9.5,  priority: ['networking']},
  { time: 10.0, priority: ['curator'] },
  { time: 10.5, priority: ['curator'] },
  { time: 11.0, priority: ['citizenship'] },
  { time: 11.5, priority: ["Public Speaking @ Ryder 207"]},
  { time: 12.0, priority: ["Public Speaking @ Ryder 207"]},
  { time: 12.5, priority: ['Public Speaking @ Ryder 207']},
  { time: 13.0, priority: ['Public Speaking @ Ryder 207']},
  { time: 13.5, priority: ['Topology @ Stetson East 020']},
  { time: 14.0, priority: ['Topology @ Stetson East 020']},
  { time: 14.5, priority: ['Topology @ Stetson East 020']},
  { time: 15.0, priority: ['Topology @ Stetson East 020']},
  { time: 15.5, priority: ['tooling']},
  { time: 16.0, priority: ['relax']},
  { time: 16.5, priority: ['curator']},
  { time: 17.0, priority: ['curator']},
  { time: 17.5, priority: ['']},
  { time: 18.0, priority: ['citizenship']},
  { time: 18.5, priority: ['relax']},
  { time: 19.0, priority: ['baxter']},
  { time: 19.5, priority: ['relax']},
  { time: 20.0, priority: ['guitar']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['mapping']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['evening routine']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
];
sat = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['sleep'] },
  { time: 6.5,  priority: ['sleep'] },
  { time: 7.0,  priority: ['sleep'] },
  { time: 7.5,  priority: ['sleep'] },
  { time: 8.0,  priority: ['sleep'] },
  { time: 8.5,  priority: ['morning routine'] },
  { time: 9.0,  priority: ['morning routine'] },
  { time: 9.5,  priority: ['commute'] },
  { time: 10.0, priority: ['mapping'] },
  { time: 10.5, priority: ['mapping'] },
  { time: 11.0, priority: ['mapping'] },
  { time: 11.5, priority: ['mapping']},
  { time: 12.0, priority: ['mapping']},
  { time: 12.5, priority: ['mapping'] },
  { time: 13.0, priority: ['mapping']},
  { time: 13.5, priority: ['compost']},
  { time: 14.0, priority: ['mapping']},
  { time: 14.5, priority: ['mapping']},
  { time: 15.0, priority: ['tooling']},
  { time: 15.5, priority: ['mapping']},
  { time: 16.0, priority: ['mapping']},
  { time: 16.5, priority: ['mapping']},
  { time: 17.0, priority: ['tooling']},
  { time: 17.5, priority: ['bits']},
  { time: 18.0, priority: ['mapping']},
  { time: 18.5, priority: ['mapping']},
  { time: 19.0, priority: ['mapping']},
  { time: 19.5, priority: ['commute']},
  { time: 20.0, priority: ['mapping']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['evening routine']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['sleep']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
]
sun = [
  { time: 0.0,  priority: ['sleep'] },
  { time: 0.5,  priority: ['sleep'] },
  { time: 1.0,  priority: ['sleep'] },
  { time: 1.5,  priority: ['sleep'] },
  { time: 2.0,  priority: ['sleep'] },
  { time: 2.5,  priority: ['sleep'] },
  { time: 3.0,  priority: ['sleep'] },
  { time: 3.5,  priority: ['sleep'] },
  { time: 4.0,  priority: ['sleep'] },
  { time: 4.5,  priority: ['sleep'] },
  { time: 5.0,  priority: ['sleep'] },
  { time: 5.5,  priority: ['sleep'] },
  { time: 6.0,  priority: ['sleep'] },
  { time: 6.5,  priority: ['sleep'] },
  { time: 7.0,  priority: ['sleep'] },
  { time: 7.5,  priority: ['sleep'] },
  { time: 8.0,  priority: ['sleep'] },
  { time: 8.5,  priority: ['morning routine'] },
  { time: 9.0,  priority: ['morning routine'] },
  { time: 9.5,  priority: ['commute'] },
  { time: 10.0, priority: ['mapping'] },
  { time: 10.5, priority: ['compost'] },
  { time: 11.0, priority: ['mapping'] },
  { time: 11.5, priority: ['mapping']},
  { time: 12.0, priority: ['mapping']},
  { time: 12.5, priority: ['mapping'] },
  { time: 13.0, priority: ['mapping']},
  { time: 13.5, priority: ['mapping']},
  { time: 14.0, priority: ['mapping']},
  { time: 14.5, priority: ['mapping']},
  { time: 15.0, priority: ['tooling']},
  { time: 15.5, priority: ['mapping']},
  { time: 16.0, priority: ['mapping']},
  { time: 16.5, priority: ['mapping']},
  { time: 17.0, priority: ['tooling']},
  { time: 17.5, priority: ['bits']},
  { time: 18.0, priority: ['mapping']},
  { time: 18.5, priority: ['guitar']},
  { time: 19.0, priority: ['guitar']},
  { time: 19.5, priority: ['guitar']},
  { time: 20.0, priority: ['guitar']},
  { time: 20.5, priority: ['guitar']},
  { time: 21.0, priority: ['evening routine']},
  { time: 21.5, priority: ['evening routine']},
  { time: 22.0, priority: ['sleep']},
  { time: 22.5, priority: ['sleep']},
  { time: 23.0, priority: ['sleep']},
  { time: 23.5, priority: ['sleep']},
]

//Meteor.subscribe('schedule');
// window.db = ScheduleTemplate
// console.log(hours)
// schedule = week.map(x => {
//   return hours.map(h => {
//     priority = ScheduleTemplate.findOne({time: h, day: x}).priority
//     return {
//       time: h,
//       priority: priority,
//     };
//   })
// })
// console.log(schedule)
week = [sun, mon, tue, wed, thu, fri, sat],

times = {};
window.times = times;
for (day in week) {
  for (block in week[day]) {
    if (week[day][block].priority) {
      project = week[day][block].priority;
      times[project] = (times[project] | 0) + 1;
    }
  }
}
window.priorities = times;

Week = {
  week: week,
  getDay(date) {
    let day = JSON.parse(JSON.stringify(week[date.getDay()]));
    let dateString = date.toLocaleDateString().split('T')[0];
    let appts = []
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
