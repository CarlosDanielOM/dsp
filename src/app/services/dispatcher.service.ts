import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Dispatcher } from '../interface/dispatcher';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatcherService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api.dsp.carlosdaniel.info/dispatchers';
  public allDispatchers = signal<Dispatcher[]>([]);

  async getDispatchers() {
    try {
      const response = await firstValueFrom(this.http.get<{data: Dispatcher[]}>(this.API_URL));
      this.allDispatchers.set(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching dispatchers:', error);
      this.allDispatchers.set([]);
    }
  }

  async createDispatcher(dispatcher: Dispatcher) {
    try {
      const response = await firstValueFrom(this.http.post<Dispatcher>(this.API_URL, dispatcher));
      this.allDispatchers.set([...this.allDispatchers(), response]);
    } catch (error) {
      console.error('Error creating dispatcher:', error);
    }
  }

  loginDispatcher(pin: string): Dispatcher | null {
    try {
      const existingDispatcher = this.allDispatchers().find(dispatcher => dispatcher.pin === pin);
      if(existingDispatcher) {
        return existingDispatcher;
      }
      return null;
    } catch (error) {
      console.error('Error logging in dispatcher:', error);
      return null;
    }
  }
}
