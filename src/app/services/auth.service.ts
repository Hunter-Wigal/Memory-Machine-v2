import { Injectable } from "@angular/core";
import { FirebaseApp } from "@angular/fire/app";
import {
    Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateCurrentUser,
    User, updateProfile
} from "@angular/fire/auth";
import { FirestoreService } from "./firestore.service";

@Injectable({
    providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth: Auth;
    private currUser: User | null;

    constructor(private app: FirebaseApp) {
        // Initialize Firebase Authentication and get a reference to the service
        this.auth = getAuth(app);
        this.currUser = null;
    }

    
    /**
     * @description Passes the user to a provided function when the authentication state changes 
     * @param func The function that will accept the user as a parameter whenever the authstate changed
     */
    public setUserFunc(func: any){
        this.auth.onAuthStateChanged( (user) => {
            this.currUser = user;
            func(user);
        })
    }

    public async registerUser(userDetails: { firstname: string, lastname: string, email: string, password: string }) {
        let user = await createUserWithEmailAndPassword(this.auth, userDetails.email, userDetails.password)
            .then((userCredential) => {
                // Signed up 

                let user = userCredential.user;
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return null;
            });

        if (this.auth.currentUser != null) {
            console.log("Added");

            let displayName = `${userDetails.firstname} ${userDetails.lastname}`;
            await updateProfile(this.auth.currentUser, { displayName });

            return user;
        }
        else {
            return null;
        }
    }

    public getCurrUser(): User | null {
        return this.auth.currentUser;
    }

    public async signIn(details: { email: string, password: string }) {
        // return setPersistence(this.auth, browserSessionPersistence).then(() => {
        return signInWithEmailAndPassword(this.auth, details.email, details.password)
            // .then((userCredential) => {
            //     return userCredential.user;
            // })
            .catch((error) => {
                console.log(error);
                return null;
            })
    }
    // )
}
// }
