import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

  constructor(private firestore: FirestoreService, private auth: AuthService) {
    this.projects = [];
    // this.projects.push({projectName: "Test", numTasks: 0, priority: 0});

    // Load projects when auth state changes
    this.auth.setUserFunc(async () => {
      await this.firestore.setuserDoc();
      this.loadProjects();
    });
    this.priorityValid = true;
  }

  loadProjects(): void {
    this.firestore.getProjects().then(async (docs) => {
      this.projects = docs.map((doc) => {
        let project = <Project>doc.data()['project'];
        project.id = doc.id;

        return project;
      });
      for (let project of this.projects) {
        this.firestore.getProjectTasks(project.id).then((tasks) => {
          project.tasks = tasks.docs.map((doc) => {
            return doc.data();
          });
          console.log(project.tasks);
        });
      }
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
    let newRow = document.getElementById('tasks-' + projectID);

    if (!newRow) return;

    newRow.style.display = newRow.style.display === 'none' ? '' : 'none';
  }

  async addTask(taskName: string, projectID: string) {
    let projectTasks = await this.firestore.getProjectTasks(projectID);
    // console.log(projectTasks.docs);

    for (let doc of projectTasks.docs) {
      console.log(doc.data());
    }
  }
}
