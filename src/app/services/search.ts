import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Search {
  private http = inject(HttpClient);
}
