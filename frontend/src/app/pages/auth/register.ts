import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirm: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formData = this.registerForm.value;
      
      // Check if passwords match
      if (formData.password !== formData.password_confirm) {
        this.errorMessage = 'Passwords do not match!';
        this.isLoading = false;
        return;
      }
      
      this.authService.register(formData).subscribe({
        next: (response) => {
          // Registration successful, now login
          this.authService.login({
            username: formData.username,
            password: formData.password
          }).subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (err) => {
              this.isLoading = false;
              this.errorMessage = 'Account created but login failed. Please try logging in manually.';
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.password?.[0] || error.error?.detail || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
