import { Parser } from "./Parser";
import { NewsCode } from "./NewsCode";

describe("parser class test", () => {
  test("news Code by string", () => {
    expect(NewsCode.LU).toEqual("LU");
  });

  test("create News", () => {
    const parser: Parser = new Parser("news/mkIT_20221109131008_10522907");
    const news = parser.createNews();
    expect(news.id).toEqual("000010522907");
    expect(news.provider).toEqual("매경인터넷");
    expect(news.link).toEqual("https://www.mk.co.kr/article/10522907");
    expect(news.title).toEqual("[포토] 활짝 웃는 송가인");
    expect(news.content).toEqual(
      "%PHOTO%TV조선 예능프로그램 ‘복덩이들고(GO)’의 온라인 기자간담회가 9일 오후 열렸다.이날 기자간담회에는 출연진 가수 송가인, 김호중과 이승훈CP, 신명선PD 등이 참석했다.[강영국 스타투데이 기자]%NEW_LINE%%NEW_LINE%%NEW_LINE%%NEW_LINE%%NEW_LINE%%NEW_LINE%[ⓒ 매일경제 &amp; mk.co.kr, 무단전재 및 재배포 금지]"
    );
    expect(news.writer).toEqual("강영국(sumur@mkinternet.com)");

    news.checkData();
    news.createFile();
  });
});
