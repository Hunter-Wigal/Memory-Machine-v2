import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';

export interface Project {
  projectName: string,
  numTasks: number,
  priority: number
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent{
  projects: Project[];
  priorityValid: boolean;

  constructor(private fs: FirestoreService){
    this.projects = [];
    this.projects.push({projectName: "Test", numTasks: 0, priority: 0});
    this.loadProjects();
    this.priorityValid = true;
  }


  loadProjects(): void {
    this.fs.getProjects().then((docs) =>{
      this.projects = docs.map((doc) => {
        return doc.data()['project'] as Project;
      })
    })
  }

  submitProject(form: NgForm){
    // Retrieve form data
    let projectName = form.value.projectName;
    let priority = form.value.priority;

    // Validate form data
    if(priority === "" || priority === null){
      this.priorityValid = false;
      return;
    }

    this.fs.addProject({projectName: projectName, numTasks: 0, priority: priority}).then(() =>{this.loadProjects(); form.reset()});
  }
}
