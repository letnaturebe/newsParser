"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = require("./Parser");
var parser = new Parser_1.Parser("news/mkIT_20221109131008_10522907");
var news = parser.createNews();
news.checkData();
news.createFile();
