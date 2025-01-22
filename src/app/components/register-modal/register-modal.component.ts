import { Component, inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
})
export class RegisterModalComponent {
  readonly dialogRef = inject(MatDialogRef<RegisterModalComponent>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  constructor(private as: AuthService) {}

  registerForm = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),

    lastNameFormControl: new FormControl('', [Validators.required]),

    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    passwordFormControl: new FormControl('', [Validators.required]),
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  public async registerUser() {
    let user = {
      firstname: this.registerForm.value?.firstNameFormControl,
      lastname: this.registerForm.value?.lastNameFormControl,
      email: this.registerForm.value?.emailFormControl,
      password: this.registerForm.value?.passwordFormControl,
    };

    if (!user.firstname || !user.lastname || !user.email || !user.password) {
      return;
    }

    await this.as.registerUser(user);

    this.as
      .signIn({
        email: user.email,
        password: user.password,
      })
      .then(() => {
        this.dialogRef.close();
        // this.currUser = this.as.getCurrUser();
        location.reload();
      });
  }
}
