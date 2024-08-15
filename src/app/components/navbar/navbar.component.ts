import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
  Routes,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { NgForm, FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// Used for an example of a custom icon
// const ACCOUNT_ICON=
// `
// <svg
//   width="100"
//   height="100"
//   viewBox="0 0 24 24"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg">
//   <!-- Circular Border -->
//   <circle
//     cx="12"
//     cy="12"
//     r="11"
//     stroke="black"
//     stroke-width="2"
//     fill="none"/>

//   <!-- Account Icon -->
//   <path
//     d="M12 2C10.067 2 8.5 3.567 8.5 5.5C8.5 7.433 10.067 9 12 9C13.933 9 15.5 7.433 15.5 5.5C15.5 3.567 13.933 2 12 2ZM12 11C9.243 11 6.801 12.216 5.312 14.073C3.934 15.805 3 17.988 3 20C3 20.553 3.447 21 4 21H20C20.553 21 21 20.553 21 20C21 17.988 20.066 15.805 18.688 14.073C17.199 12.216 14.757 11 12 11Z"
//     fill="black"/>
// </svg>
// `

@Component({
  selector: 'app-navbar',
  standalone: true,
  //TODO figure out how to simplify this
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatAnchor,
    FormsModule,
    MatNavList,
    MatListItem,
    MatIcon,
    MatButtonModule,
    MatToolbarRow,
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
    //, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.currUser = this.authService.getCurrUser();
    this.authService.setUserFunc((user: User) => {
      this.currUser = user;
    });
    this.router = router;

    // iconRegistry.addSvgIconLiteral('account', sanitizer.bypassSecurityTrustHtml(ACCOUNT_ICON));
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
