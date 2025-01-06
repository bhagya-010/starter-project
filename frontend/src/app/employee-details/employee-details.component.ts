import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core'; // Import the signal function
import { PageLayoutComponent } from '../page-layout/page-layout.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PageLayoutComponent, RouterModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  employee = signal<any | null>(null); // Signal to hold employee details
  errorMessage = signal(''); // Signal to track error message

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    const headers = this.authService.getAuthHeaders();

    this.http.get<any>(`http://localhost:3000/employee/${employeeId}`, { headers }).subscribe({
      next: (response) => {
        this.employee.set(response); // Update employee details signal
      },
      error: (err) => {
        this.errorMessage.set(err.error.message || 'Failed to load employee details.'); // Set error message signal
        console.error(err);
      },
    });
  }
}
