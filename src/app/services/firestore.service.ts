import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { Task } from '../pages/tasks/tasks.component';
import { Project } from '../pages/projects/projects.component';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

interface cachedProject {
  projectName: string;
  numTasks: number;
  priority: number;
  id: string;
  tasks: Object;
}

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private userPath = 'userStored';
  private userDoc!: DocumentReference;

  private readonly platformId = inject(PLATFORM_ID);

  constructor(private db: Firestore, private authService: AuthService) {}

  public async setuserDoc() {
    this.userDoc = doc(
      this.db,
      'userStored',
      `${this.authService.getCurrUser()?.uid}`
    );
  }

  async getTasks() {
    if (this.userDoc == null) {
      await this.setuserDoc();
    }

    return getDocs(collection(this.db, this.userDoc.path, 'tasks'));
  }

  insertNewTask(task: Task) {
    let coll = collection(this.db, this.userDoc.path, 'tasks');
    return addDoc(coll, { task });
  }

  async deleteTask(id: string | undefined) {
    if (id == undefined) {
      return new Promise(() => {
        return false;
      });
    }

    return deleteDoc(doc(this.db, this.userDoc.path, 'tasks', id))
      .then(() => {
        window.alert('Successfully deleted task');
        return true;
      })
      .catch(() => {
        window.alert('Error with deleting task');
        return false;
      });
  }

  getProjects() {
    let docs = getDocs(collection(this.db, this.userDoc.path, 'projects')).then(
      (response) => {
        return response.docs;
      }
    );

    return docs;
  }

  addProject(project: Project) {
    let coll = collection(this.db, this.userDoc.path, 'projects');
    return addDoc(coll, { project }).then(
      (response) => {
        console.log('Added new document');
        console.log(response);
        return true;
      },
      (error) => {
        return false;
      }
    );
  }

  async deleteProject(id: string) {
    return deleteDoc(doc(this.db, this.userDoc.path, 'projects', id))
      .then(() => {
        window.alert('Successfully deleted project');
        return true;
      })
      .catch(() => {
        window.alert('Error with deleting project');
        return false;
      });
  }

  async getProjectTasks(projectID: string) {
    return getDocs(
      collection(
        this.db,
        this.userDoc.path,
        `projects/${projectID}/projectTasks`
      )
    );
  }

  async addTask(projectID: string, taskName: string) {
    let taskColl = collection(
      this.db,
      this.userDoc.path,
      `projects/${projectID}/projectTasks`
    );
    return addDoc(taskColl, { taskName });
  }

  async deleteProjectTask(projectID: string, taskID: string) {
    return deleteDoc(
      doc(
        this.db,
        this.userDoc.path,
        `projects/${projectID}/projectTasks/${taskID}`
      )
    );
  }

  cacheProjects(key: string, object: Project[]) {
    let newCache = object.map((project) => {
      if (project.tasks == null) {
        project.tasks = [];
      }
      let newProject: cachedProject = {
        projectName: project.projectName,
        id: project.id,
        numTasks: project.numTasks,
        priority: project.priority,
        tasks: Object.assign({}, project.tasks),
      };
      return newProject;
    });

    window.sessionStorage.setItem(key, JSON.stringify(newCache));
  }

  getCachedProjects(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(key);
    } else {
      return null;
    }
  }
}
