import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  User,
  updateProfile,
  browserSessionPersistence,
  Persistence,
} from '@angular/fire/auth';
import { platform } from 'os';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth;
  private currUser: User | null;
  private browserID: object;

  constructor(
    private app: FirebaseApp,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.currUser = null;
    this.browserID = platformId;
    this.auth = getAuth(this.app);
  }

  ngOnInit(): void {
    // Initialize Firebase Authentication and get a reference to the service
    this.auth.setPersistence(browserSessionPersistence);
  }

  public isBrowser(): boolean {
    return isPlatformBrowser(this.browserID);
  }

  /**
   * @description Passes the user to a provided function when the authentication state changes
   * @param func The function that will accept the user as a parameter whenever the authstate changed
   */
  public setUserFunc(func: any) {
    if (!this.isBrowser()) return;
    this.auth.onAuthStateChanged((user) => {
      this.currUser = user;
      func(user);
    });
  }

  public async registerUser(userDetails: {
    firstname: string | null | undefined;
    lastname: string | null | undefined;
    email: string | null | undefined;
    password: string | null | undefined;
  }) {
    if (userDetails.email == null || userDetails.password == null) return;

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
    )
      .then(() => {
        localStorage.setItem('loggedIn', 'true');
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  public async signOut() {
    this.auth.signOut();
    localStorage.setItem('loggeddIn', 'false');
  }

  public authenticated(): boolean {
    return this.currUser != null;
  }

  public setPersistance(persistance: Persistence) {
    this.auth.setPersistence(persistance);
  }
}
