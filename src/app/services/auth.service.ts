import { Injectable } from "@angular/core";
import { FirebaseApp } from "@angular/fire/app";
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { User, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, updateCurrentUser, updateProfile } from "firebase/auth";

@Injectable({
    providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth: Auth;

    constructor(private app: FirebaseApp) {
        // Initialize Firebase Authentication and get a reference to the service
        this.auth = getAuth(app);
        this.auth.setPersistence(browserSessionPersistence);
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
        else{
            return null;
        }
    }

    public getCurrUser(): User | null {
        return this.auth.currentUser;
    }

    public signIn(details: {email: string, password: string}){
        return signInWithEmailAndPassword(this.auth, details.email, details.password)
        // .then((userCredential) => {
        //     return userCredential.user;
        // })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }
}
