import { Component, effect, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DocumentData, getDocs } from '@angular/fire/firestore';

export interface Project {
  projectName: string;
  numTasks: number;
  priority: number;
  id: string;
  tasks: Array<DocumentData>;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatTable,
    MatTableModule,
    MatSlideToggle,
    MatCheckbox,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: Project[];
  priorityValid: boolean;
  displayedColumns: string[] = ['name', 'tasks', 'priority', 'taskButton'];
  finishedSetting = signal(false);

  constructor(private firestore: FirestoreService, private auth: AuthService) {
    this.projects = [];
    // this.projects.push({projectName: "Test", numTasks: 0, priority: 0});
    this.priorityValid = true;

    effect(()=>{
      if(this.finishedSetting()){
        this.cacheProjects();
      }
    })
  }

  ngAfterContentInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // Load projects when auth state changes
    this.auth.setUserFunc(async () => {
      await this.firestore.setuserDoc();

      this.loadProjects();
    });
  }

  checkCachedProjects() {
    let cachedProjects = this.firestore.getCachedProjects('projects');
    if (cachedProjects != null) {
      return JSON.parse(cachedProjects);
    }

    return null;
  }

  cacheProjects() {
    // Cache data
    // if (this.projects != null) {
    //   let tasks = new Array<Array<string>>();
    //   for (let project of this.projects) {
    //     let index = 0;
    //     console.log(project.tasks);

    //     for (let task of project.tasks) {
    //       tasks[index++].push(task['name']);
    //     }
    //   }
    //   this.firestore.cacheProjects('projects', this.projects, tasks);
    // }
    this.firestore.cacheProjects('projects', this.projects);
  }

  loadProjects(): void {
    let cachedProjects = this.checkCachedProjects();

    if (cachedProjects != null) {
      let projArr = new Array<Project>();
      for (let project in cachedProjects) {
        projArr.push(cachedProjects[project]);
      }
      this.projects = projArr;

      console.log('loaded cache');
      return;
    }

    this.firestore.getProjects().then(async (docs) => {
      this.projects = docs.map((doc) => {
        let project = <Project>doc.data()['project'];
        project.id = doc.id;
        project.tasks = new Array<DocumentData>();
        return project;
      });

      for (let project of this.projects) {
        await this.firestore.getProjectTasks(project.id).then((tasks) => {
          project.tasks = tasks.docs.map((doc) => {
            return doc.data();
          });
        });
      }

      this.finishedSetting.set(true);
    });
  }

  submitProject(form: NgForm) {
    // Retrieve form data
    let projectName = form.value.projectName;
    let priority = form.value.priority;

    // Validate form data
    if (priority === '' || priority === null) {
      this.priorityValid = false;
      return;
    }

    this.firestore
      .addProject({
        projectName: projectName,
        numTasks: 0,
        priority: priority,
        id: '',
        tasks: [],
      })
      .then(() => {
        this.loadProjects();
        form.reset();
      });
  }

  deleteProject(id: string = '') {
    this.firestore.deleteProject(id).then((success) => {
      if (success) this.loadProjects();
    });
  }

  showTasks(projectID: string) {
    let newTasks = document.getElementById('taskadd-' + projectID);
    let newRow = document.getElementById('tasks-' + projectID);

    if (!newRow || !newTasks) return;

    newRow.style.display = newRow.style.display === 'none' ? '' : 'none';
    newTasks.style.display = newTasks.style.display === 'none' ? '' : 'none';
  }

  async addTask(taskName: string, projectID: string) {
    let projectTasks = await this.firestore.getProjectTasks(projectID);
    // console.log(projectTasks.docs);

    for (let doc of projectTasks.docs) {
      console.log(doc.data());
    }
  }
}
