export class InvalidNewsData extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidNewsData";
  }
}
