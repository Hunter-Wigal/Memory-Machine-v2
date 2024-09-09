import { Time } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Timestamp, addDoc } from 'firebase/firestore';
import { FirestoreService } from '../../services/firestore.service';
import {
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { After } from 'v8';
import { AuthService } from '../../services/auth.service';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Observable, Subscriber } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularMaterialModule } from '../../material.module';
import { MatCardModule } from '@angular/material/card';
import { CalendarComponent } from "../../components/calendar/calendar.component";

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
  providers: [],
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CalendarComponent
],
})
export class TasksComponent {
  @ViewChild('taskForm') taskForm!: NgForm;
  @ViewChild('matTable') table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;

  selected = model<Date | null>(null);

  dataSource = new MatTableDataSource<Task>();

  columnsToDisplay = ['title', 'date', 'time', 'delete'];

  constructor(private firestore: FirestoreService, private auth: AuthService) {
    // Load tasks when auth state changes
    this.auth.setUserFunc(async () => {
      await this.firestore.setuserDoc();
      this.updatetasks();
    });
  }

  updatetasks() {
    let tasks: Task[] = [];
    this.firestore.getTasks().then((response) => {
      if (response == undefined) {
        return;
      }
      for (let item of response.docs) {
        let data = item.data()['task'];
        let task = {
          title: data['title'],
          date: new Date(data['date'].seconds * 1000),
          id: item.id,
        };
        tasks.push(task);
      }

      // Set new data and rerender table rows
      this.dataSource = new MatTableDataSource(tasks);
      this.table.renderRows();

      // Has to be set after the table already has data. Don't ask why
      this.dataSource.sort = this.sort;
    });
  }

  addTask(newTask: Task) {
    let taskDate = new Date(newTask.date);
    taskDate.setDate(taskDate.getUTCDate());

    // Extract the hours and minutes from the string. Easiest way to do it
    if (newTask.time != undefined && newTask.time != '') {
      let split = newTask.time.split(':');
      let taskTime = { hours: Number(split[0]), minutes: Number(split[1]) };
      taskDate.setHours(taskTime.hours, taskTime.minutes);
    }
    // Assume end of day if not specified
    else taskDate.setHours(23, 59);

    // Call function in firestore service, handle return value from promise
    this.firestore
      .insertNewTask({ title: newTask.title, date: taskDate })
      .then((success) => {
        if (success) {
          this.taskForm.reset();
          window.alert('Successfully added new task!');
          this.updatetasks();
        } else {
          window.alert('Failed to add new task');
        }
      });
  }

  deleteTask(id: string | undefined) {
    this.firestore.deleteTask(id).then((success) => {
      if (success) {
        this.updatetasks();
      }
    });
  }
}
