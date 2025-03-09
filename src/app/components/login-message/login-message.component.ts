import {
  AfterContentInit,
  Component,
  Inject,
  PLATFORM_ID,
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
  authVerified = false;
  private isBrowser: boolean;

  constructor(
    private as: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.authVerified = false;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterContentInit(): void {
    if (!this.authVerified && this.isBrowser) {
      this.checkAuth();
    }
  }

  async checkAuth() {
    if(!this.as.authenticated() && this.as.isBrowser()){
      this.authVerified = true;
    }
  }
}
