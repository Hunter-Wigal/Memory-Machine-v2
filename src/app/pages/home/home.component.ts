import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public testEmail = "No email";
  
  constructor(private authService: AuthService){
  }

  public async testAdd(){
    console.log("Adding");
    // let user = await this.authService.SignUp();
    // if (user != null && user.email != null){
    //   console.log(user.email);
    //   this.testEmail = user.email;
    // }

    let currUser = this.authService.getCurrUser()
    currUser?.delete().then(
      () => {
        console.log("Successfully deleted current user");
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }
}
