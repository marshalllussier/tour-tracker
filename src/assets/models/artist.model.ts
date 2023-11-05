import { Event } from './event.model'

export class Artist {
  constructor(
    public name: string,
    public id: string,
    public genres: string[],
    public imageUrl: string,
    public events: Event[]
  ) {}
}
