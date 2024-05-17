import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: "/home",
        pathMatch: 'full'
    },
    {
        path: 'tasks',
        component: TasksComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'schedule',
        component: ScheduleComponent
    },
    {
        path: 'projects',
        component: ProjectsComponent
    },
];
