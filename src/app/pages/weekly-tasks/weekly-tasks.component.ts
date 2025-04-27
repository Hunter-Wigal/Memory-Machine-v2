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
import { FirestoreService } from '../../services/firestore.service';
import { DocumentData } from 'firebase/firestore';
import { AuthService } from '../../services/auth.service';

interface Week {
  id: string;
  row?: number;
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
  protected taskRows: Array<Week> = [];
  protected taskList: Array<WeeklyTask> = [];
  public dragging: HTMLElement | null = null;
  protected draggingX = 0;
  protected draggingY = 0;
  controller!: AbortController;
  private dragdropAPI: dd.DragDropAPI;
  /** TODO change the type here */
  protected firestoreDocs!: DocumentData;
  protected addedRows = 0;

  @ViewChild('newRow', { static: true }) newRow!: ElementRef;
  fetchedRows: number = 0;

  constructor(private fs: FirestoreService, private as: AuthService) {
    this.taskList.push({ taskID: '0', taskName: 'Test' });

    this.dragdropAPI = new dd.DragDropAPI();
    this.dragdropAPI.droppedClass = 'dropped';
    this.dragdropAPI.dropFunction = this.onDrop;
  }
  ngAfterContentInit(): void {
    // throw new Error('Method not implemented.');
    // TODO fetch from firebase and populate rows
    this.as.setUserFunc(async () => {
      await this.fs.setuserDoc();
      this.updateWeekly();
      this.updateTasklist().then(() => {
        $(() => {
          this.dragdropAPI.appendDrag();
          // $('.draggable').on('mouseover', (event) => {
          //   console.log(event);
          // });
        });
      });
    });
  }

  updateWeekly() {
    this.firestoreDocs = this.fs.getWeekly().then((docs) => {
      this.taskRows = new Array();
      for (let item of docs) {
        let data = <Week>item.data();
        data.id = item.id;
        if (data.row != undefined) this.taskRows[data.row] = data;
        else console.log('broken');
      }
      this.fetchedRows = this.taskRows.length;
      return docs;
    });
  }

  async updateTasklist() {
    return this.fs.getWeeklyTaskList().then((docs) => {
      this.taskList = new Array();
      for (let item of docs) {
        let data = item.data();
        this.taskList.push({ taskID: item.id, taskName: data['taskName'] });
      }
      return true;
    });
  }

  // Element that it was dropped onto
  onDrop(arg: HTMLElement) {
    // TODO add a new row if the current row is the last
    let currRow = arg.parentElement;

    let newRow = $('#newRow');

    if (
      currRow &&
      currRow.nextElementSibling &&
      newRow.is(currRow.nextElementSibling)
    ) {
      let clone = $(newRow).clone();
      clone.removeClass('new-row');
      clone.addClass('data-row');
      clone.attr('id', '');
      clone.css('display', '');
      clone.attr('rownum', String(this.addedRows++));
      clone.insertBefore(newRow);

      this.setDroppableEventListeners();
    }
  }

  save() {
    let toSave = new Array<Week>();
    $('.data-row').each((index, element) => {
      if (element.classList.contains('ng-star-inserted')) return;
      let rownum = element.attributes.getNamedItem('rownum')?.value;
      let children = $(element).children();
      let newWeek: Week = Object();
      newWeek.sunday = children[0].innerText;
      newWeek.monday = children[1].innerText;
      newWeek.tuesday = children[2].innerText;
      newWeek.wednesday = children[3].innerText;
      newWeek.thursday = children[4].innerText;
      newWeek.friday = children[5].innerText;
      newWeek.saturday = children[6].innerText;
      newWeek.row = Number(rownum) + this.fetchedRows;
      toSave.push(newWeek);
    });
    // Remove empty row at end
    toSave.pop();
    this.fs.addToWeekly(toSave).then(() => {
      // this.updateWeekly();
      window.location.reload();
    });
  }

  // Actually calls dragdrop service
  setDroppableEventListeners() {
    throw new Error('Method not implemented.');
  }

  setDraggableEventListeners() {
    throw new Error('Method not implemented.');
  }

  deleteRow(weekID: string) {
    this.fs.deleteFromWeekly(weekID).then(() => {
      window.alert('Successfully deleted');
      window.location.reload();
    });
  }

  addTask(taskName: string) {
    this.fs.addToWeeklyTaskList(taskName).then(() => {
      window.location.reload();
    });
  }

  deleteTask(taskID: string) {
    this.fs.deleteFromWeeklyTaskList(taskID);
    window.location.reload();
  }
}
