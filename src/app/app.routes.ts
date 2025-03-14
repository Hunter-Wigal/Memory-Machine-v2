import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CalendarPage } from './pages/calendar/calendar-page.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { Component } from '@angular/core';
import { WeeklyTasksComponent } from './components/weekly-tasks/weekly-tasks.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: TasksComponent,
    data: { title: 'Tasks' },
  },
  {
    path: 'calendar',
    component: CalendarPage,
    data: { title: 'Calendar' },
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    data: { title: 'Schedule' },
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { title: 'Projects' },
  },
  {
    path: 'weekly-tasks',
    component: WeeklyTasksComponent,
    data: {title: 'Weekly Tasks'}
  },
];
