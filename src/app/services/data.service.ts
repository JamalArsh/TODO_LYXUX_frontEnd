import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:5000';
  constructor(private http: HttpClient) {}

  getAllTasks() {
    return this.http.get<any[]>(`${this.baseUrl}/`);
  }

  addNewTask(todo: any) {
    return this.http.post<any>(`${this.baseUrl}/save`, todo);
  }

  deleteTask(todoID: any) {
    return this.http.delete<any>(`${this.baseUrl}/delete`, todoID);
  }

  updateTask(todo: any) {
    return this.http.post<any>(`${this.baseUrl}/update`, todo);
  }
}
