import fs from "fs";
import iconv from "iconv-lite";
import { NewsCode } from "./NewsCode";
import { News } from "./News";
import { InvalidNewsData } from "./InvalidNewsData";
import * as cheerio from "cheerio";

export class Parser {
  static readonly PRESS_NAME: string = "매일경제";
  static readonly PRESS_CODE: string = "mk";
  static readonly PRESS_ID: number = 9;
  static readonly PRESS_DOMAIN: string = "mk.co.kr";
  static readonly PRESS_ENCODING: string = "euc-kr";
  static readonly NEW_LINE: string = "%NEW_LINE%";
  static readonly FLOAT_DOT: string = "%FLOAT_DOT%";
  static readonly PHOTO: string = "%PHOTO%";
  static readonly VIDEO: string = "%VIDEO%";

  private readonly filePath: string;
  private readonly rawContent: string[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.rawContent = this.loadContent();
  }

  public loadContent() {
    const data = fs.readFileSync(this.filePath);
    const decodedData = iconv.decode(data, Parser.PRESS_ENCODING);
    return decodedData.replace(/<(\/span|span)([^>]*)>/gi, "").split(";");
  }

  public createNews(): News {
    const id: string = this.parseId();
    const provider: string = this.parseProvider();
    const link: string = this.parseLink();
    const title: string = this.parseTitle();
    const content: string = this.parseContent();
    const writer: string = this.parseWriter();
    return new News(id, provider, link, title, content, writer);
  }

  private parseId(): string {
    let id: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.NO) {
        id = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (id == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode NO in the XML file",
      );
    }

    return id;
  }

  private parseProvider(): string {
    let provider: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.SO) {
        provider = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (provider == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode SO in the XML file",
      );
    }

    return provider;
  }

  private parseLink(): string {
    let link: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.LU) {
        link = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (link == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode LU in the XML file",
      );
    }

    return link;
  }

  private parseTitle(): string {
    let title: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.TI) {
        title = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (title == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode TI in the XML file",
      );
    }

    return title;
  }

  private parseContent(): string {
    let content: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.TX) {
        content = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (content == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode TX in the XML file",
      );
    }

    content = content
      .replace("<!-- r_start //--><!-- r_end //-->\r\n", "")
      .replace(/^\r\n/, "")
      .replace(/^\n/, "")
      .replace(/<br>/gi, "")
      .replace(/\r\n/gi, Parser.NEW_LINE + Parser.NEW_LINE)
      .replace(/\n/gi, Parser.NEW_LINE + Parser.NEW_LINE)
      // eslint-disable-next-line no-useless-escape
      .replace(/\<\!--\[\[\-\-image([0-9])\-\-\]\]\/\/\--\>/gi, Parser.PHOTO);

    const html = cheerio.load(content);

    html("a").remove();
    html("#relnews_list").remove();
    let htmlContent = html("body").html()?.trim();

    if (htmlContent == undefined) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode TX in the XML file",
      );
    }

    htmlContent = htmlContent.replace("<!-- r_start //--><!-- r_end //-->", "");

    htmlContent = htmlContent
      .replace(/^\%\NEW_LINE\%/, "")
      .replace(
        "%NEW_LINE%%NEW_LINE%%NEW_LINE%%NEW_LINE% [ⓒ",
        "%NEW_LINE%%NEW_LINE%[ⓒ"
      )
      .replace(/\[매일경제(.*)기자\] /gi, "")
      .replace(/\매경닷컴(.*)기자/gi, "");

    return htmlContent;
  }

  private parseWriter(): string {
    let writer: string | null = null;
    for (const line of this.rawContent) {
      const code = line.substring(0, 2);
      if (code == NewsCode.WT) {
        writer = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
        break;
      }
    }

    if (writer == null) {
      throw new InvalidNewsData(
        "The news data is invalid, please check NewsCode WT in the XML file",
      );
    }

    return writer;
  }
}
