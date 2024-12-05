import { AfterContentInit, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { NgForm, FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { AuthModalButtonsComponent } from "../auth-modal-buttons/auth-modal-buttons.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  //TODO figure out how to simplify this
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatNavList,
    MatListItem,
    MatIcon,
    MatButtonModule,
    AuthModalButtonsComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements AfterContentInit {
  protected currUser: User | null;

  public router: Router;

  constructor(private authService: AuthService, router: Router) {
    this.currUser = this.authService.getCurrUser();
    this.authService.setUserFunc((user: User) => {
      this.currUser = user;
    });
    this.router = router;
  }

  ngAfterContentInit() {
    this.currUser = this.authService.getCurrUser();
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
