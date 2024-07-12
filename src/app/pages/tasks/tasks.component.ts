import { Time } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Timestamp, addDoc } from 'firebase/firestore';
import { FirestoreService } from '../../services/firestore.service';
import { FormControl, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { CalendarComponent } from "../../pages/calendar/calendar.component";
import { After } from 'v8';
import { AuthService } from '../../services/auth.service';

// Temp class
export interface Task {
  title: string;
  date: Date;
  time?: String;
  id?: string;
}



@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [DatePipe, FormsModule, CalendarComponent]
})


export class TasksComponent {
  @ViewChild('taskForm') taskForm!: NgForm;


  testClass = "test"


  tasks: Task[] = [];


  constructor(private firestore: FirestoreService, private auth: AuthService) {
    // Load tasks when auth state changes
    this.auth.setUserFunc(async ()=>{await this.firestore.setuserDoc(); this.updatetasks()});
  }


  updatetasks() {
    this.tasks = [];

    this.firestore.getTasks().then((response) => {
      if (response == undefined) {
        return;
      }

      for (let item of response.docs) {
        let data = item.data()['task']
        let task = { title: data['title'], date: new Date(data['date'].seconds * 1000), id: item.id }
        this.tasks.push(task);
      }
    })
  }

  addTask(newTask: Task) {
    let taskDate = new Date(newTask.date);

    // Extract the hours and minutes from the string. Easiest way to do it
    if (newTask.time != undefined && newTask.time != '') {
      let split = newTask.time.split(":");
      let taskTime = { hours: Number(split[0]), minutes: Number(split[1]) };
      taskDate.setHours(taskTime.hours, taskTime.minutes);
    }
    else
      // Assume end of day if not specified
      taskDate.setHours(23, 59);

    // Call function in firestore service, handle return value from promise
    this.firestore.insertNewTask({ title: newTask.title, date: taskDate }).then((success) => {
      if (success) {
        this.taskForm.reset();
        window.alert("Successfully added new task!");
        this.updatetasks();
      }
      else {
        window.alert("Failed to add new task");
      }
    })
  }

  deleteTask(id: string | undefined){
      this.firestore.deleteTask(id).then((success)=>{
        if (success){
          this.updatetasks();
        }
      })
  }

}
