import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-auth-modal-buttons',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './auth-modal-buttons.component.html',
  styleUrl: './auth-modal-buttons.component.scss',
})
export class AuthModalButtonsComponent implements AfterViewInit {
  @ViewChild('signIn') loginModal!: ElementRef;
  @ViewChild('signUp') registerUserModal!: ElementRef;

  registerForm = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),

    lastNameFormControl: new FormControl('', [Validators.required]),

    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    passwordFormControl: new FormControl('', [Validators.required]),
  });

  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    passwordFormControl: new FormControl('', [Validators.required]),
  });

  constructor(private as: AuthService) {}

  ngAfterViewInit(): void {}

  public registerModal() {
    let modal = this.registerUserModal.nativeElement;
    modal.showModal();
    // this.registerForm.form.markAsUntouched();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
  }

  public signInModal() {
    let modal = this.loginModal.nativeElement;
    modal.showModal();

    modal.getElementsByClassName('close')[0].addEventListener('click', () => {
      modal.close();
    });
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

    let credentials = await this.as.signIn({
      email: user.email,
      password: user.password,
    });

    this.registerUserModal.nativeElement.close();
    // this.currUser = this.as.getCurrUser();
    location.reload();
  }

  public async login() {
    let user = {
      email: this.loginForm.value?.emailFormControl,
      password: this.loginForm.value?.passwordFormControl,
    };

    console.log(this.loginForm.value);

    let credentials = await this.as.signIn({
      email: user.email ? user.email : '',
      password: user.password ? user.password : '',
    });

    if (credentials != undefined) {
      // this.currUser = credentials.user;
      this.loginForm.reset();
      this.loginModal.nativeElement.close();
      location.reload();
    }
  }
}
