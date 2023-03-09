import { Parser } from "./Parser";

const parser: Parser = new Parser("news/mkIT_20221109131008_10522907");
const news = parser.createNews();
news.checkData();
