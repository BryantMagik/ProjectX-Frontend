import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpClient = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  get<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.httpClient.get<T>(url, options);
  }
  post<T>(url: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.httpClient.post<T>(url, data, options);
  }
  put<T>(url: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.httpClient.put<T>(url, data, options);
  }
  delete<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.httpClient.delete<T>(url, options);
  }
  patch<T>(url: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.httpClient.patch<T>(url, data, options);
  }
}
