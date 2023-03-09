import { Parser } from "./Parser";
import fs from "fs";

const parser: Parser = new Parser("news/mkIT_20221109131008_10522907");
const news = parser.createNews();
news.checkData();
news.createFile();