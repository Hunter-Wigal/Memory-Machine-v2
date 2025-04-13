import {
  Component,
  ElementRef,
  ViewChild,
  viewChild,
  AfterContentInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import $ from 'jquery';
import * as dd from '../../services/dragdrop.service';

interface Week {
  sunday: string | null;
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
}

interface WeeklyTask {
  taskID: string;
  taskName: String;
}

@Component({
  selector: 'app-weekly-tasks',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './weekly-tasks.component.html',
  styleUrl: './weekly-tasks.component.scss',
})
export class WeeklyTasksComponent implements AfterContentInit {
  protected taskRow: Array<Week> = [];
  protected taskList: Array<WeeklyTask> = [];
  public dragging: HTMLElement | null = null;
  protected draggingX = 0;
  protected draggingY = 0;
  controller!: AbortController;
  private dragdropAPI: dd.DragDropAPI;

  @ViewChild('addAbove') addAbove!: ElementRef;
  @ViewChild('newRow', { static: true }) newRow!: ElementRef;

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

    this.dragdropAPI = new dd.DragDropAPI();
    this.dragdropAPI.droppedClass = 'dropped';
    this.dragdropAPI.dropFunction = this.onDrop;
  }
  ngAfterContentInit(): void {
    // throw new Error('Method not implemented.');
    $(document).ready(() => {
      this.dragdropAPI.appendDrag();
      // $('.draggable').on('mouseover', (event) => {
      //   console.log(event);
      // });
    });
  }

  // Element that it was dropped onto
  onDrop(arg: HTMLElement) {
    // TODO add a new row if the current row is the last
    let currRow = arg.parentElement;

    console.log(currRow?.nextElementSibling);

    let newRow = $('#newRow');

    if (currRow && currRow.nextElementSibling && newRow.is(currRow.nextElementSibling)) {
      let clone = $(newRow).clone();
      clone.removeClass('new-row');
      clone.addClass('data-row');
      clone.attr('id', '');
      clone.css('display', '');
      clone.insertBefore(newRow);

      this.setDroppableEventListeners();
    }
  }

  // Actually calls dragdrop service
  setDroppableEventListeners() {
    throw new Error('Method not implemented.');
  }

  setDraggableEventListeners() {
    throw new Error('Method not implemented.');
  }

  deleteTask(taskID: string) {}
}
