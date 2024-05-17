import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TasksComponent } from "./tasks/tasks.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { FirebaseApp } from '@angular/fire/app';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, TasksComponent, NavbarComponent, FooterComponent]
})
export class AppComponent {
  title = 'memory_machine_app';
  
}
