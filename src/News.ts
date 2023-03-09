/* eslint-disable no-console */
import fs from "fs";

export class News {
  static readonly FILE_PATH: string = "result.txt";
  private readonly _id: string;
  private readonly _provider: string;
  private readonly _link: string;
  private readonly _title: string;
  private readonly _content: string;
  private readonly _writer: string;

  constructor(
    id: string,
    provider: string,
    link: string,
    title: string,
    content: string,
    writer: string,
  ) {
    this._id = id;
    this._provider = provider;
    this._link = link;
    this._title = title;
    this._content = content;
    this._writer = writer;
  }

  get id(): string {
    return this._id;
  }

  get provider(): string {
    return this._provider;
  }

  get link(): string {
    return this._link;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get writer(): string {
    return this._writer;
  }

  public checkData() {
    console.log("Title:", this.title);
    console.log("Provider:", this.provider);
    console.log("Link:", this.link);
    console.log("Content:", this.content);
    console.log("Writer:", this.writer);
  }

  public createFile() {
    if (fs.existsSync(News.FILE_PATH)) {
      fs.unlink(News.FILE_PATH, (err) => {
        if (err) {
          return;
        }
      });
    }

    fs.writeFile(News.FILE_PATH, this.content, (err) => {
      if (err) throw err;
    });
  }
}
