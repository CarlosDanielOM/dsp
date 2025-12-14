import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { form, Field, required, minLength, maxLength, pattern } from '@angular/forms/signals'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router); // Inject Router

  isLoading = signal(false);
  hasError = signal(false);
  
  // Toast State: Stores message and type ('success' or 'error')
  toast = signal<{message: string, type: 'success' | 'error'} | null>(null);

  loginModel = signal({
    pin: ''
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.pin, { message: 'PIN is required' });
    minLength(schemaPath.pin, 4, { message: 'PIN must be exactly 4 digits' });
    maxLength(schemaPath.pin, 4, { message: 'PIN must be exactly 4 digits' });
    pattern(schemaPath.pin, /^[0-9]+$/, { message: 'PIN must be numeric' })
  });

  async login(event: Event) {
    event.preventDefault();

    if (this.loginForm.pin().invalid()) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.hideToast(); // Clear previous toasts

    setTimeout(() => {
      // Mock Check: PIN '1234'
      if (this.loginModel().pin === '1234') {
        
        // 1. Show Success Toast
        this.showToast('Identity Verified. Access Granted.', 'success');
        this.isLoading.set(false);

        // 2. Redirect after 1.5s delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);

      } else {
        // 1. Show Error Toast & Shake
        this.hasError.set(true);
        this.showToast('Authentication Failed. Invalid Credential.', 'error');
        this.isLoading.set(false);
        
        // Auto-hide error toast after 3 seconds
        setTimeout(() => this.hideToast(), 3000);
      }
    }, 1500);
  }

  // Helper to show toast
  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
  }

  // Helper to hide toast
  hideToast() {
    this.toast.set(null);
  }
}