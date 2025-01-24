import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {} from '@angular/material/index';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

/*
Each row has a time, and possible a different event for each day at that time
*/

interface Time {
  hours: number;
  minutes: number;
}

export interface EventType {
  eventName: string;
  startTime: Time;
  endTime: Time;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  id: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    MatButton,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  dataSource: Array<EventType> = [];
  displayedColumns = [
    'times',
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'delete',
  ];

  eventForm = new FormGroup({
    eventName: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    sunday: new FormControl(false),
    monday: new FormControl(false),
    tuesday: new FormControl(false),
    wednesday: new FormControl(false),
    thursday: new FormControl(false),
    friday: new FormControl(false),
    saturday: new FormControl(false),
  });

  @ViewChild('matTable') table!: MatTable<any>;

  constructor(private fs: FirestoreService, private as: AuthService) {}

  ngOnInit(): void {
    this.as.setUserFunc(async () => {
      await this.fs.setuserDoc();
      this.updateSchedule();
    });
  }

  updateSchedule() {
    this.fs.getSchedule().then((schedule) => {
      this.dataSource = [];
      for (let doc of schedule) {
        let data = doc.data();
        let startTime = data['startTime'].split(':');
        let endTime = data['endTime'].split(':');
        let id = doc.id;

        let newRow: EventType = {
          eventName: data['eventName'],
          startTime: {
            hours: Number(startTime[0]),
            minutes: Number(startTime[1]),
          },
          endTime: {
            hours: Number(endTime[0]),
            minutes: Number(endTime[1]),
          },
          sunday: data['sunday'],
          monday: data['monday'],
          tuesday: data['tuesday'],
          wednesday: data['wednesday'],
          thursday: data['thursday'],
          friday: data['friday'],
          saturday: data['saturday'],
          id: id,
        };
        this.dataSource.push(newRow);
      }
      this.table.renderRows();
    });
  }

  addEvent() {
    this.fs.addToSchedule(this.eventForm.value).then((response) => {
      window.alert('Successfully added new event!');
      this.eventForm.reset();
      this.updateSchedule();
    });
  }

  deleteEvent(id: string) {
    this.fs
      .deleteFromSchedule(id)
      .then(() => {
        window.alert('Successfully removed event');
        this.updateSchedule();
      })
      .catch((err) => {
        window.alert(`Could not remove event: ${err}`);
      });
  }
}
