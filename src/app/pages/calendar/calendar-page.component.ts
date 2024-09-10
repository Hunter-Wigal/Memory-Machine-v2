import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatCardModule } from '@angular/material/card';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';


export interface Event {
  number: number;
  name: string;
  date: Date;
  location?: string;
  time?: string;
}

const SAMPLE_EVENTS: Event[] = [
  { number: 1, name: 'Event ', date: new Date(), location: 'Work' },
  { number: 2, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 3, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 4, name: 'Event ', date: new Date(), location: 'Home' },
  { number: 5, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 6, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 7, name: 'Event ', date: new Date(), location: 'Home' },
  { number: 8, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 9, name: 'Event ', date: new Date(), location: 'Anywhere' },
  { number: 10, name: 'Event ', date: new Date(), location: 'Site 3' },
];

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, CalendarComponent, MatTableModule, DatePipe],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss',
})
export class CalendarPage {

  displayedColumns: string[] = ['number', 'name', 'date', 'location'];
  dataSource: Event[] | null;

  constructor(){
    this.dataSource = SAMPLE_EVENTS;
  }
}
