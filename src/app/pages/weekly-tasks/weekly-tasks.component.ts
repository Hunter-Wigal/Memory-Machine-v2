import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
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
  protected dragging: HTMLElement | null = null;
  protected draggingX = 0;
  protected draggingY = 0;

  constructor() {
    this.taskRow.push({
      sunday: 'Do Something on this day',
      monday: 'Something',
      tuesday: 'Something',
      wednesday: null,
      thursday: 'Something',
      friday: null,
      saturday: 'Something',
    });

    this.taskList.push({ taskID: '0', taskName: 'Test' });
  }

  deleteTask(taskId: string) {}

  eventListener(event: MouseEvent) {
    this.setElementPosition(event.clientX, event.clientY);
    console.log(event);
    return this;
  }

  mouseDown(event: MouseEvent, id: string) {
    this.dragging = document.getElementById(id);
    if(!this.dragging)
      return
    this.draggingX = this.dragging.getBoundingClientRect().x;
    this.draggingY = this.dragging.getBoundingClientRect().y;
    let width = this.dragging.getBoundingClientRect().width;

    this.dragging.style.position = "absolute";
    this.setElementPosition(this.draggingX, this.draggingY);
    this.dragging.style.width = width + "px";
    this.dragging.style.zIndex = '100';

    console.log(this.dragging);
    // this.dragging = event.target;
    document.addEventListener('mousemove', ($event)=>{this.eventListener(<MouseEvent>$event)});
  }

  mouseUp(event: Event) {
    document.removeEventListener('mousemove', ($event)=>{this.eventListener(<MouseEvent>$event);});
  }

  setElementPosition(x: number, y: number){
    if(!this.dragging)
      return;
    console.log(this.dragging.style.x);
    this.dragging.style.left = x + 'px';
    this.dragging.style.top = y + 'px';
  }
}
