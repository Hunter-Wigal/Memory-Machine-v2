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
  public dragging: HTMLElement | null = null;
  protected draggingX = 0;
  protected draggingY = 0;
  controller!: AbortController;


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


  mouseDown(event: MouseEvent, id: string) {
    this.dragging = document.getElementById(id);
    if(!this.dragging)
      return

    this.draggingX = this.dragging.getBoundingClientRect().x;
    this.draggingY = this.dragging.getBoundingClientRect().y;
    // let width = this.dragging.getBoundingClientRect().width;
    this.dragging.style.zIndex = '-1';

    this.dragging.style.position = "absolute";
    this.dragging.style.width = 100 + "px";
    this.dragging.style.zIndex = '100';
    this.controller = new AbortController();
    document.addEventListener('mousemove', ($event)=>{this.setElementPosition($event)}, {signal: this.controller.signal});
  }

  mouseUp(event: Event) {
    console.log("called")
    this.controller.abort();

  }

  setElementPosition(event: MouseEvent){
    if (!this.dragging) return;

    let sunday = document.getElementById("drop-sunday");
    if(!sunday)return;

    let rects = sunday.getBoundingClientRect();

    if(event.clientX > rects.x && event.clientY > rects.y && event.clientX < rects.x + rects.width && event.clientY < rects.y + rects.height){
      this.highlight("drop-sunday", "yellow");
    }
    else{
      this.highlight('drop-sunday', '--mat-app-background-color');
    }


    let x = event.clientX;
    let y = event.clientY;
    if(!this.dragging)
      return;
    // console.log(this.dragging.style.top);
    // console.log(y);
    let height = this.dragging.clientHeight;
    let width = this.dragging.clientWidth;

    this.dragging.style.left = (x - width / 2) + 'px';
    this.dragging.style.top = (y - height- 10) + 'px';
  }

  highlight(id: string, color: string){
    let drop = document.getElementById(id);
    console.log(color);
    if(!drop)
      return;

    if(color.charAt(0) == '-')
    drop.style.backgroundColor = drop.style.getPropertyValue('color');

    else
    drop.style.backgroundColor = color;
  }
}
