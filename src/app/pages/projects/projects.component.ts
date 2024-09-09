import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

export interface Project {
  projectName: string;
  numTasks: number;
  priority: number;
  id?: string;
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
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: Project[];
  priorityValid: boolean;
  displayedColumns: string[] = ['name', 'tasks', 'priority'];

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
    this.firestore.getProjects().then((docs) => {
      this.projects = docs.map((doc) => {
        let project = <Project>doc.data()['project'];
        project.id = doc.id;
        return project;
      });

    
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
      .addProject({ projectName: projectName, numTasks: 0, priority: priority })
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
}
