import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // Import RouterModule

@Component({
  selector: 'app-root',  // Root selector for the app
  standalone: true,
  imports: [CommonModule, RouterModule],  // Include RouterModule for routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

} 
//changes test


