import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, mergeMap} from "rxjs/operators";
import {forkJoin, Observable, of} from "rxjs";
import {Character, film, homeWorld, information, transport} from "./model/starWarsHeroes";

/* Сервис загрузки героев */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  /* Загружает героев*/
  loadHero(): Observable<any> {
    return this.http.get('https://swapi.dev/api/people/?page=1').pipe(
      mergeMap((user: any) => {
        const j = Math.ceil(user.count / 10);
        const m = [];
        for (let i = 1; i <= j; i++) {
          m.push(this.http.get(`https://swapi.dev/api/people/?page=${i}`).pipe(catchError(err => of(null))));
        }
        return forkJoin(m);
      })
    )
  }
  /*Возвращает все о герое*/
  getHero(dto: any): Observable<information> {
    const character: Character = dto as Character;
    const m: Observable<film>[] = [];
    if (dto?.films?.length) {
      for (let i = 0; i < dto.films.length; i++) {
        m.push(this.http.get(dto.films[i]).pipe(catchError(err => of(null))).pipe<film>(map<any, film>((e) => {
            return {
              title: e.title,
              release_date: e.release_date
            }
          }))
        );
      }
    }
    const vehiclesObsr: Observable<transport>[] = [];
    for (let i = 0; i < dto.vehicles.length; i++) {
      vehiclesObsr.push(this.http.get(dto.vehicles[i]).pipe(catchError(err => of(null))).pipe(map<any, transport>(el => {
        return {
          name: el.name,
          model: el.model
        }
      })));
    }
    const starshipsObsr: Observable<transport>[] = [];
    for (let i = 0; i < dto.starships.length; i++) {
      starshipsObsr.push(this.http.get(dto.starships[i]).pipe(catchError(err => of(null))).pipe(map<any, transport>(el => {
        return {
          name: el.name,
          model: el.model
        }
      })));
    }
    const info = [];
    const films: Observable<film[]> = forkJoin(m);
    info.push(films);
    const homeworld: Observable<homeWorld> = this.http.get(dto.homeworld).pipe(catchError(err => of(null))).pipe(map<any, homeWorld>((el: any) => {
      return {name: el.name, population: el.population}
    }));
    info.push(homeworld);
    let vehicles: Observable<transport[]> | undefined;
    if (vehiclesObsr.length > 0) {
      vehicles = forkJoin(vehiclesObsr);
      info.push(vehicles);
    }
    let starships: Observable<transport[]> | undefined;
    if (starshipsObsr.length > 0) {
      starships = forkJoin(starshipsObsr);
      info.push(starships);
    }

    return forkJoin(info).pipe<information>(
      map<any, information>(([res1, res2, res3, res4]) => {
        let transport = {vehicles: undefined, starships: undefined}
        if (vehicles) {
          transport.vehicles = res3;
          if (starships) {
            transport.starships = res4;
          }
        } else if (starships) {
          transport.starships = res3
        }
        return {
          character: character,
          films: res1,
          homeWorld: res2,
          transport: transport
        }
      })
    );
  }
}
