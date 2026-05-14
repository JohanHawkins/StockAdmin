import { Component } from '@angular/core';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}