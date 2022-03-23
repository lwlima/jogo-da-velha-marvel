import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarvelApiService {

  serverURL: string = 'http://gateway.marvel.com';
  endpoint: string = 'v1/public/characters'
  publicKey: string = 'debe72c062ee5aeb0d4b3e933ecbad95';
  hash: string = '1175c9895d2f582a6260124b2a2f8bda';
  ts: string = '1';

  URL: string = `${this.serverURL}/${this.endpoint}?ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`

  constructor(private http: HttpClient) { }

  public getCharacterByName(name: string): Observable<Object>{
    return this.http.get(`${this.URL}&name=${name}`)
  }
}
