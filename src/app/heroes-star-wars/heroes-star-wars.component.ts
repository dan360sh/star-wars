import {Component, OnInit} from '@angular/core';
import {HttpService} from "./http.service";
import {information} from "./model/starWarsHeroes";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-heroes-star-wars',
  templateUrl: './heroes-star-wars.component.html',
  styleUrls: ['./heroes-star-wars.component.scss']
})
export class HeroesStarWarsComponent implements OnInit {

  constructor(private httpService: HttpService) {

  }
  private infoObservable?: Subscription;
  info?: information;
  readonly listHeroes: any[] = [];
  busyindicator = false;
  busyindicatorInfo = false;

  ngOnInit(): void {
    this.busyindicator = true;
    this.httpService.loadHero().subscribe(result => {
      result.forEach((item: any) => {
        this.busyindicator = false;
        this.listHeroes.push(...item.results);
      })
    })
  }

  /*Выбирает героя*/
  chooseHero(hero: any) {
    this.busyindicatorInfo = true;
    this.infoObservable?.unsubscribe();
    this.infoObservable = this.httpService.getHero(hero.value).subscribe(result => {
      this.busyindicatorInfo = false;
      this.busyindicator = false;
      this.info = result;
    });
  }
}

