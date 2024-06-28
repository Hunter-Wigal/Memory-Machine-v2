import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ProjectsComponent } from './pages/projects/projects.component';

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
