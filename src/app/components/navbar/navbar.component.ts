import {
  AfterContentInit,
  Component,
  ElementRef,
  NgModule,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
// Temp solution
import { NgForm, FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthModalButtonsComponent } from '../auth-modal-buttons/auth-modal-buttons.component';

interface NavLink{
  path: string,
  displayName: string
}

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
    MatMenuModule,
    AuthModalButtonsComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements AfterContentInit {
  protected currUser: User | null;
  private userFuncSet: boolean = false;
  public router: Router;
  private userSet: boolean = false;
  protected links: Array<NavLink> = [
    { path: '/tasks', displayName: 'Tasks' },
    { path: '/calendar', displayName: 'Calendar' },
    { path: '/schedule', displayName: 'Schedule' },
    { path: '/projects', displayName: 'Projects' },
    { path: '/weekly-tasks', displayName: 'Weekly' },
  ];

  constructor(private authService: AuthService, router: Router) {
    this.currUser = this.authService.getCurrUser();
    this.router = router;
  }

  ngAfterContentInit() {
    if (!this.userFuncSet) {
      this.authService.setUserFunc((user: User) => {
        if (!this.userSet) this.currUser = user;
      });
      this.userFuncSet = true;
    }
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
