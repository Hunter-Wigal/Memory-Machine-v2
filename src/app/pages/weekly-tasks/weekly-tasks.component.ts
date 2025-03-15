import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface Week {
  sunday: string | null;
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
}

interface WeeklyTask{
  taskID: string,
  taskName:String
}

@Component({
  selector: 'app-weekly-tasks',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './weekly-tasks.component.html',
  styleUrl: './weekly-tasks.component.scss',
})
export class WeeklyTasksComponent {
  protected taskRow: Array<Week> = [];
  protected taskList: Array<WeeklyTask> = [];

  constructor() {
    this.taskRow.push({
      sunday: "Do Something on this day",
      monday: "Something",
      tuesday: "Something",
      wednesday: null,
      thursday: "Something",
      friday: null,
      saturday: "Something",
    });

    this.taskList.push({taskID: "0", taskName: "Test"});
  }

  deleteTask(taskId: string){

  }
}
