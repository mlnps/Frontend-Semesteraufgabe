import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Plant {
  id: number;
  title: string;
  location: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  apiUrl = 'http://localhost:3001/plants';

  constructor(private http: HttpClient) { }


  public addPlant(plant: any): Promise<Plant> {
    return this.http
      .post<Plant>(`${this.apiUrl}`, plant, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Type': 'application/json',
        }),
      })
      .toPromise();
  }

  public getAll(): Promise<Plant[]> {
    return this.http
      .get<Plant[]>(`${this.apiUrl}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Type': 'application/json',
        }),
      })
      .toPromise();
  }
}
