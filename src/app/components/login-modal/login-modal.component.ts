import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  readonly dialogRef = inject(MatDialogRef<LoginModalComponent>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor(private as: AuthService) {}

  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    passwordFormControl: new FormControl('', [Validators.required]),
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  public async login() {
    let user = {
      email: this.loginForm.value?.emailFormControl,
      password: this.loginForm.value?.passwordFormControl,
    };

    this.as
      .signIn({
        email: user.email ? user.email : '',
        password: user.password ? user.password : '',
      })
      .then(() => {
        this.loginForm.reset();
        this.dialogRef.close();
        location.reload();
      });
  }
}
