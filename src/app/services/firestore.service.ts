import { Injectable } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { Task } from '../pages/tasks/tasks.component';
import { Project } from '../pages/projects/projects.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private userPath = 'userStored';
  private userDoc!: DocumentReference;

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

    // let docs = getDocs(collection(this.db, "tasks")).then((response) => {
    //     return response.docs;
    // });

    // return docs;
  }

  insertNewTask(task: Task) {
    let coll = collection(this.db, this.userDoc.path, 'tasks');
    // let coll = collection(this.db, `userStored/${this.authService.getCurrUser()?.uid}/tasks`)
    // TODO update this to work for different users
    return addDoc(coll, { task });
    // return addDoc(collection(this.db, "tasks"), { task }).then(
    //     (response) => {
    //         console.log("Added new document");
    //         console.log(response);
    //         return true;
    //     },
    //     (error) => {
    //         return false;
    //     }
    // );
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
}
