import { ElementRef, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  User,
  updateProfile,
  browserSessionPersistence,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth;
  private currUser: User | null;
  private loginModal!: ElementRef;
  private registerUserModal!: ElementRef;

  constructor(private app: FirebaseApp) {
    // Initialize Firebase Authentication and get a reference to the service
    this.auth = getAuth(app);
    this.auth.setPersistence(browserSessionPersistence);
    this.currUser = null;
  }

  /**
   * @description Passes the user to a provided function when the authentication state changes
   * @param func The function that will accept the user as a parameter whenever the authstate changed
   */
  public setUserFunc(func: any) {
    this.auth.onAuthStateChanged((user) => {
      this.currUser = user;
      func(user);
    });
  }

  public async registerUser(userDetails: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    let user = await createUserWithEmailAndPassword(
      this.auth,
      userDetails.email,
      userDetails.password
    )
      .then((userCredential) => {
        // Signed up

        let user = userCredential.user;
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(`${errorCode}: ${errorMessage}`);
        return null;
      });

    if (this.auth.currentUser != null) {
      console.log('Added');

      let displayName = `${userDetails.firstname} ${userDetails.lastname}`;
      await updateProfile(this.auth.currentUser, { displayName });

      return user;
    } else {
      return null;
    }
  }

  public getCurrUser(): User | null {
    return this.auth.currentUser;
  }

  public async signIn(details: { email: string; password: string }) {
    return signInWithEmailAndPassword(
      this.auth,
      details.email,
      details.password
    ).catch((error) => {
      console.log(error);
      return null;
    });
  }

  public async signOut() {
    this.auth.signOut();
  }

  public authenticated(): boolean {
    return this.currUser != null;
  }

  public setRegisterrModal(modal: ElementRef) {
    this.registerUserModal = modal;
  }

  public setLoginModal(modal: ElementRef) {
    this.loginModal = modal;
  }

  public registerModal() {
    let modal = this.registerUserModal.nativeElement;
    modal.showModal();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
  }

  public signInModal() {
    let modal = this.loginModal.nativeElement;
    modal.showModal();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
  }
}
