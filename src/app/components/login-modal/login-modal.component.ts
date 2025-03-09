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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';

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
    MatCheckboxModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  readonly dialogRef = inject(MatDialogRef<LoginModalComponent>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  checked: boolean;
  constructor(private as: AuthService) {
    this.checked = false;
  }

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
    let persistance = (this.checked) ? browserLocalPersistence : browserSessionPersistence;
    this.as.setPersistance(persistance);
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

  updateChecked(checked: boolean){
    this.checked = checked;
  }
}
