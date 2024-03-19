import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:9090'; // Base URL of your backend API

  constructor(private http: HttpClient) {}

  testOnWindows(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/test-windows`, {});
  }

  testOnLinux(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/test-linux`, {});
  }
}
