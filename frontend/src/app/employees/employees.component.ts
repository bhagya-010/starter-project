import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core'; 
import { PageLayoutComponent } from '../page-layout/page-layout.component';
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, PageLayoutComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees = signal<any[]>([]); // Signal to track employee list
  errorMessage = signal(''); // Signal to track error message
  loading = signal(true); // Signal to track loading state

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get<any>('http://localhost:3000/employees', { headers }).subscribe({
      next: (response) => {
        this.employees.set(response.data); // Update employee list signal
        this.loading.set(false); // Set loading state to false
      },
      error: (err) => {
        this.errorMessage.set(err.error.message || 'Failed to load employees.'); // Set error message signal
        this.loading.set(false); // Set loading state to false
        console.error(err);
      },
    });
  }
}
