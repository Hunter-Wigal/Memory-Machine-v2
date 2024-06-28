import { Injectable } from "@angular/core";
import { Firestore, QueryDocumentSnapshot, addDoc, collection, getDocs } from "@angular/fire/firestore";
import { Task } from '../pages/tasks/tasks.component'
import { Project } from "../pages/projects/projects.component";

@Injectable({
    providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class FirestoreService {

    constructor(private db: Firestore) {
    }

    getTasks() {
        let docs = getDocs(collection(this.db, "tasks")).then((response) => {
            return response.docs;
        });

        return docs;
    }

    insertNewTask(task: Task) {
        // TODO update this to work for different users
        return addDoc(collection(this.db, "tasks"), { task }).then(
            (response) => {
                console.log("Added new document");
                console.log(response);
                return true;
            },
        (error) => {
            return false;
        }
        );
    }

    getProjects(){
        let docs = getDocs(collection(this.db, "projects")).then((response) => {
            return response.docs;
        });

        return docs;
    }

    addProject(project: Project){
        return addDoc(collection(this.db, "projects"), { project }).then(
            (response) => {
                console.log("Added new document");
                console.log(response);
                return true;
            },
        (error) => {
            return false;
        }
        );
    }

}