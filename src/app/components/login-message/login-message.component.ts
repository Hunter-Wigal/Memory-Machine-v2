import {
  AfterContentInit,
  Component,
  Inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { AuthModalButtonsComponent } from '../auth-modal-buttons/auth-modal-buttons.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login-message',
  standalone: true,
  imports: [MatButtonModule, AuthModalButtonsComponent],
  templateUrl: './login-message.component.html',
  styleUrl: './login-message.component.scss',
})
export class LoginMessageComponent implements AfterContentInit {
  authVerified = signal(false);
  private isBrowser: boolean;

  constructor(
    private as: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {

    this.authVerified.set(false);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterContentInit(): void {
    if (!this.authVerified() && this.isBrowser) {
      this.checkAuth();
    }
  }

  async checkAuth() {
    // should be authVerifiedFalse because it's checking if it was verified to be false
    if(!this.as.authenticated() && this.as.isBrowser() && !this.parseBoolean(localStorage.getItem("loggedIn"))){
      this.authVerified.set(true);
    }
  }

  parseBoolean(str: string | null): boolean {
    if (str === null) {
      localStorage.setItem('loggedIn', 'false');
      return false;
    }
    return str.toLowerCase() === 'true';
}
}
