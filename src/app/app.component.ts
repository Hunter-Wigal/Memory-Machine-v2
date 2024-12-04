import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { map, filter } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { AuthService } from './services/auth.service';
import { LoginMessageComponent } from './components/login-message/login-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FormsModule,
    MatSortModule,
    LoginMessageComponent,
  ],
})
export class AppComponent {
  title = 'memory_machine_app';
  authenticated = false;
  homePage = false;

  public constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private as: AuthService
  ) {}

  ngOnInit(): void {
    //TODO figure out observables
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child: ActivatedRoute | null = this.route.firstChild;
          let title = child && child.snapshot.data['title'];
          if (title) {
            if (title === 'Home') this.homePage = true;
            else this.homePage = false;
            return title;
          }
        })
      )
      .subscribe((title) => {
        if (title) {
          this.titleService.setTitle(`${title}`);
        }
      });

    this.as.setUserFunc(() => {
      this.authenticated = this.as.authenticated();
    });
  }
}
