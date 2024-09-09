import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatNativeDateModule, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-calendar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatCardModule, MatNativeDateModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  selected = model<Date | null>(null);

  // rows = [
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0],
  // ];

  // monthName = 'January';
  // constructor() {
  //   this.setCalendar();
  // }

  // private setCalendar() {
  //   let today = new Date();

  //   // First day of month
  //   let firstDay = new Date(today.getFullYear(), today.getMonth());
  //   // Last day of month
  //   let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  //   // Starting index. Sunday = 0, Saturday = 6
  //   let start = firstDay.getDay();
  //   let end = lastDay.getDate();

  //   let day = 1;

  //   for (let row of this.rows) {
  //     for (let i = start; i < 7; i++) {
  //       if (day > end) {
  //         break;
  //       }
  //       row[i] = day++;
  //     }
  //   }

  //   this.monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
  //     today
  //   );
  // }
}
