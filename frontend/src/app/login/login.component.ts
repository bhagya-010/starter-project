import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal } from '@angular/core'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal(''); 

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {

      this.errorMessage.set('Please fix the errors in the form before submitting.');
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    this.http
      .post<{ message: string; token: string }>('http://localhost:3000/login', { email, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.errorMessage.set(error.error.message || 'Login failed');
        },
      });
  }  
}
