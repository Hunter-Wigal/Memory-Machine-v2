import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-message',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './login-message.component.html',
  styleUrl: './login-message.component.scss',
})
export class LoginMessageComponent implements OnInit {

  timerFinished = false;
  timerRunning = false;

  constructor(private as: AuthService) {}

  ngOnInit(): void {
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.checkAuth().then();
    }
  }

  async checkAuth() {
    return setTimeout(() => {
      this.timerFinished = true;
      this.timerRunning = false;
    }, 3000);
  }

  protected registerModal() {
    this.as.registerModal();
  }

  protected signInModal() {
    this.as.signInModal();
  }
}
