import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, Field, required, minLength, maxLength, pattern } from '@angular/forms/signals'; 
import { DispatcherService } from '../services/dispatcher.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router); // Inject Router
  private dispatcherService = inject(DispatcherService);

  isLoading = signal(false);
  hasError = signal(false);
  isSetupMode = signal(false);
  
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

  registrationModel = signal({
    name: '',
    pin: ''
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.pin, { message: 'PIN is required' });
    minLength(schemaPath.pin, 4, { message: 'PIN must be exactly 4 digits' });
    maxLength(schemaPath.pin, 4, { message: 'PIN must be exactly 4 digits' });
    pattern(schemaPath.pin, /^[0-9]+$/, { message: 'PIN must be numeric' })
  });

  ngOnInit() {
    this.dispatcherService.getDispatchers().then(() => {
      this.checkDispatchers();
    });
  }

  async checkDispatchers() {
    try {
      const dispatchers = this.dispatcherService.allDispatchers();
      let checkIfSetup = !dispatchers || dispatchers.length === 0;
      this.isSetupMode.set(checkIfSetup);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Error checking dispatchers:', error);
      this.isSetupMode.set(false);
      this.showToast('Error checking dispatchers. Please try again.', 'error');
      this.isLoading.set(false);
      setTimeout(() => this.hideToast(), 3000);
    }
  }

  async register(event: Event) {
    event.preventDefault();


    if(this.registrationForm().invalid()) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.hideToast();

    try {
      await this.dispatcherService.createDispatcher(this.registrationModel());
      this.showToast('Dispatcher registered successfully.', 'success');
      this.isLoading.set(false);
      this.isSetupMode.set(false);
    } catch (error) {
      console.error('Error registering dispatcher:', error);
      this.hasError.set(true);
      this.showToast('Registration failed. Please try again.', 'error');
      this.isLoading.set(false);
      setTimeout(() => this.hideToast(), 3000);
    }
  }

  async login(event: Event) {
    event.preventDefault();

    if (this.loginForm.pin().invalid()) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.hideToast(); 

    try {
      const dispatcher = this.dispatcherService.loginDispatcher(this.loginForm.pin().value());
      if(dispatcher) {
        this.showToast(`Welcome, ${dispatcher.name}!`, 'success');
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      } else {
        this.hasError.set(true);
        this.showToast('Authentication failed. Invalid credential.', 'error');
        this.isLoading.set(false);
        setTimeout(() => this.hideToast(), 3000);
      }
    } catch (error) {
      console.error('Error logging in dispatcher:', error);
      this.hasError.set(true);
      this.showToast('Authentication failed. Please try again.', 'error');
      this.isLoading.set(false);
      setTimeout(() => this.hideToast(), 3000);
    }
    
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