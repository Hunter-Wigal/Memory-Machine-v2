import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbar, MatAnchor, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  protected currUser: User | null;

  @ViewChild("signIn") loginModal!: ElementRef;
  @ViewChild("signUp") registerUserModal!: ElementRef;

  constructor(private authService: AuthService) {
    this.currUser = this.authService.getCurrUser();
    this.authService.setUserFunc((user: User) => {
      this.currUser = user;
    })
  }

  ngOnInit() {
    this.currUser = this.authService.getCurrUser();
  }

  public registerModal(modal: HTMLDialogElement) {
    modal.showModal();

    modal.getElementsByClassName("close")[0].addEventListener("click", () => {
      modal.close();
    })
  }

  public signInModal(modal: HTMLDialogElement) {
    modal.showModal();

    modal.getElementsByClassName("close")[0].addEventListener("click", () => {
      modal.close();
    })
  }

  public async registerUser(userForm: NgForm) {
    let user = userForm.form.value;

    await this.authService.registerUser(user);

    let credentials = await this.authService.signIn({ email: user.email, password: user.password });

    this.registerUserModal.nativeElement.close()
    this.currUser = this.authService.getCurrUser();
    location.reload();
  }

  public async login(userForm: NgForm) {
    let user = userForm.form.value;

    let credentials = await this.authService.signIn({ email: user.email, password: user.password });


    if (credentials != undefined) {
      this.currUser = credentials.user;
      userForm.resetForm();
      this.loginModal.nativeElement.close()
      location.reload();
    }
  }

  public async signOut(){
    await this.authService.signOut();
    location.reload();
  }
}
