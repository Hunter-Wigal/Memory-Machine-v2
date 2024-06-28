import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { FormsModule, NgForm } from '@angular/forms';
import { OnInit } from '@angular/core'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  protected currUser: User | null;

  constructor(private authService: AuthService) {
    this.currUser = this.authService.getCurrUser();
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

  public signInModal(modal: HTMLDialogElement){
    modal.showModal();

    modal.getElementsByClassName("close")[0].addEventListener("click", () => {
      modal.close();
    })
  }

  public async registerUser(userForm: NgForm) {
    let user = userForm.form.value;

    await this.authService.registerUser(user);

    let credentials = await this.authService.signIn({ email: user.email, password: user.password });

    this.currUser = this.authService.getCurrUser();


  }

  public async login(userForm: NgForm) {
    let user = userForm.form.value;

    let credentials = await this.authService.signIn({ email: user.email, password: user.password });

    if (credentials != undefined)
      this.currUser = credentials.user;
  }
}
