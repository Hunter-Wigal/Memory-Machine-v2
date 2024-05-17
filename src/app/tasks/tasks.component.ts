import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// Temp class
interface Task{
  desc: string;
  date: Date;
  time?: Time;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})


export class TasksComponent implements OnInit{
  value: String = "Test render"

  testNum: number = 10;

  testClass = "test"

  items = ["item1", "item2", "item3", "item4"];

  tasks: Task[] = [{desc: "Assignment1", date: new Date('11-11-11')}];

  constructor(){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  addOne(){
    this.testNum += 1;
  }
}
