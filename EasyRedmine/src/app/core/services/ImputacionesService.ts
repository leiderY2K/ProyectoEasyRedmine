import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImputacionesService {
  private http = inject(HttpClient);

  enviarImputaciones(payload: Record<number, {imputationDate: string; hours: number; comment: string; activityId: number }[]>) {
    return this.http.post('http://localhost:3000/api/imputaciones', payload);
  }

  obtenerMisPeticiones() {
    return this.http.get<any[]>(
      'http://localhost:3000/api/imputaciones/mis-peticiones'
    );
  }

  obtenerActividades(tracker?: string): Observable<{ id: number; name: string }[]> {
    let params = new HttpParams();
    if (tracker) {
      params = params.set('tracker', tracker);
    }
    return this.http.get<{ id: number; name: string }[]>(
      `http://localhost:3000/api/imputaciones/actividades`,
      { params }
    );
  }

  obtenerPeticionesGenerales(tracker?: string): Observable<{ id: number; name: string }[]> {
    let params = new HttpParams();
    if (tracker) {
      params = params.set('tracker', tracker);
    }
    return this.http.get<{ id: number; name: string }[]>(
      `http://localhost:3000/api/imputaciones/peticiones-generales`,
      { params }
    );
  }

}
