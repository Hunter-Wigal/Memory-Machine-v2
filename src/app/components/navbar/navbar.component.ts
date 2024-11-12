import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { NgForm, FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  //TODO figure out how to simplify this
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    FormsModule,
    MatNavList,
    MatListItem,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected currUser: User | null;

  @ViewChild('signIn') loginModal!: ElementRef;
  @ViewChild('signUp') registerUserModal!: ElementRef;

  public router: Router;

  constructor(private authService: AuthService, router: Router) {
    this.currUser = this.authService.getCurrUser();
    this.authService.setUserFunc((user: User) => {
      this.currUser = user;
    });
    this.router = router;

  }

  ngOnInit() {
    this.currUser = this.authService.getCurrUser();
  }

  public registerModal(modal: HTMLDialogElement) {
    modal.showModal();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
  }

  public signInModal(modal: HTMLDialogElement) {
    modal.showModal();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
  }

  public async registerUser(userForm: NgForm) {
    let user = userForm.form.value;

    await this.authService.registerUser(user);

    let credentials = await this.authService.signIn({
      email: user.email,
      password: user.password,
    });

    this.registerUserModal.nativeElement.close();
    this.currUser = this.authService.getCurrUser();
    location.reload();
  }

  public async login(userForm: NgForm) {
    let user = userForm.form.value;

    let credentials = await this.authService.signIn({
      email: user.email,
      password: user.password,
    });

    if (credentials != undefined) {
      this.currUser = credentials.user;
      userForm.resetForm();
      this.loginModal.nativeElement.close();
      location.reload();
    }
  }

  public async signOut() {
    await this.authService.signOut();
    location.reload();
  }

  public accountDropdown(dropdown: HTMLElement) {
    dropdown.style.display =
      dropdown.style.display == 'none' || dropdown.style.display == ''
        ? 'flex'
        : 'none';
  }
}
