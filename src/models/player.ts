export class Player {
  name: string;

  constructor(fields: Pick<Player, "name">) {
    this.name = fields.name ?? "No name";
  }
}
