import { Component, effect, signal, AfterContentInit } from '@angular/core';
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
  tasks: Array<any>;
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
export class ProjectsComponent implements AfterContentInit {
  projects: Project[];
  priorityValid: boolean;
  displayedColumns: string[] = ['name', 'tasks', 'priority', 'taskButton'];
  finishedSetting = signal(false);

  constructor(private firestore: FirestoreService, private auth: AuthService) {
    this.projects = [];
    // this.projects.push({projectName: "Test", numTasks: 0, priority: 0});
    this.priorityValid = true;

    this.auth.setUserFunc(async () => {
      await this.firestore.setuserDoc();

      this.loadProjects(true);
    });

    // Caches projects after the've been loaded once
    effect(() => {
      if (this.finishedSetting()) {
        this.cacheProjects();
      }
    });
  }

  ngAfterContentInit() {}

  checkCachedProjects(): Project[] {
    let cachedProjects = this.firestore.getCachedProjects('projects');
    if (cachedProjects != null) {
      return JSON.parse(cachedProjects);
    }

    return [];
  }

  cacheProjects() {
    this.firestore.cacheProjects('projects', this.projects);
  }

  loadProjects(checkCached: boolean): void {
    let cachedProjects = this.checkCachedProjects();

    if (cachedProjects.length > 0 && checkCached) {
      this.projects = [];

      for (let project of cachedProjects) {
        let taskArr = [];

        for (let task in project.tasks) {
          taskArr.push(project.tasks[task]);
        }
        project.tasks = taskArr;
        this.projects.push(project);
      }

      console.log('loaded cache');
      console.log(this.projects);
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
        this.loadProjects(false);
        form.reset();
      });
  }

  deleteProject(id: string = '') {
    this.firestore.deleteProject(id).then((success) => {
      if (success) this.loadProjects(false);
    });
  }

  showTasks(projectID: string) {
    let newTasks = document.getElementById('taskadd-' + projectID);
    let newRows = document.getElementsByClassName('tasks');

    if (!newRows || !newTasks) return;

    for (let row in newRows) {
      if ((<HTMLElement>newRows[row]).style != undefined)
        (<HTMLElement>newRows[row]).style.display =
          (<HTMLElement>newRows[row]).style.display === 'none' ? '' : 'none';
    }

    newTasks.style.display = newTasks.style.display === 'none' ? '' : 'none';

    this.flipIcon(projectID);
  }

  flipIcon(projectID: string) {
    let icon = document.getElementById('icon-' + projectID);
    if (!icon) return;

    icon.style.transform = icon.style.transform.includes('180deg')
      ? 'rotate(0deg)'
      : 'rotate(180deg)';
  }

  async addTask(taskName: string, projectID: string) {
    console.log(taskName);
    this.firestore.addTask(projectID, taskName).then((result) => {
      this.loadProjects(false);
    });
  }
}
