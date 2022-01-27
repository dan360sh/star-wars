/* Свойства персонажа */
export interface Character {
  /* Имя персонажа */
  name: string,
  /* Высота персонажа */
  height?: string,
  /* Масса персонажа */
  mass?: string,
  /* цвет волос*/
  hair_color?: string,
  /* цвет кожи*/
  skin_color?: string,
  /* цвет глаз*/
  eye_color?: string,
  /* год рождения */
  birth_year?: string,
  /* гендер */
  gender?: string,
}
/* Родной мир персонажа */
export interface homeWorld{
  /* Наименование планеты */
  name: string,
  /* Популяция */
  population: string
}

/* Фильм */
export interface film{
  title: string,
  release_date: string
}
/* Транспорт */
export interface transport{
  name: string,
  model: string
}

export interface information{
  character: Character,
  homeWorld?: homeWorld,
  films: film[],
  transport: {
    vehicles?: transport[],
    starships?: transport[]
  }
}
