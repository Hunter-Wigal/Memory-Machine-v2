import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  model,
  signal,
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
import { MatDialog } from '@angular/material/dialog';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-auth-modal-buttons',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './auth-modal-buttons.component.html',
  styleUrl: './auth-modal-buttons.component.scss',
})
export class AuthModalButtonsComponent {
  @ViewChild('signIn') loginModal!: ElementRef;
  @ViewChild('signUp') registerUserModal!: ElementRef;
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterModalComponent, {
      data: { name: this.name(), animal: this.animal() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      data: { name: this.name(), animal: this.animal() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}
