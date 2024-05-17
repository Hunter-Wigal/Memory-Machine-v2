import { Time } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Timestamp, addDoc } from 'firebase/firestore';
import { FirestoreService } from '../../firestore.service';
import { FormControl, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';

// Temp class
export interface Task {
  title: string;
  date: Date;
  time?: String;
}



@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})


export class TasksComponent implements OnInit {
  @ViewChild('taskForm') taskForm!: NgForm;
  
  value: String = "Test render"

  testNum: number = 10;

  testClass = "test"

  items = ["item1", "item2", "item3", "item4"];

  tasks: Task[] = [];




  constructor(private firestore: FirestoreService) {
  }


  updatetasks(){
    this.tasks = [];

    this.firestore.getTasks().then((response) => {
      for (let item of response) {
        let data = item.data()['task'];
        console.log(data);
        let task = { title: data['title'], date: new Date(data['date'].seconds * 1000) }
        this.tasks.push(task);
      }
    })
  }

  ngOnInit(): void {
    this.updatetasks();
  }

  addTask(newTask: Task) {
    let taskDate = new Date(newTask.date);

    if (newTask.time != undefined && newTask.time != '') {
      let split = newTask.time.split(":");
      let taskTime = {hours: Number(split[0]), minutes: Number(split[1])};
      taskDate.setHours(taskTime.hours, taskTime.minutes);
    }
    else
      taskDate.setHours(23, 59);

    this.firestore.insertNewTask({ title: newTask.title, date: taskDate }).then((success) => {
      if (success){
        this.taskForm.reset();
        window.alert("Successfully added new task!");
        this.updatetasks();
      }
      else{
        window.alert("Failed to add new task");
      }
    })


  
  }

  addOne() {
    this.testNum += 1;
  }
}
