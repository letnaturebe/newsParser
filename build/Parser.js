"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var fs_1 = __importDefault(require("fs"));
var iconv_lite_1 = __importDefault(require("iconv-lite"));
var NewsCode_1 = require("./NewsCode");
var News_1 = require("./News");
var InvalidNewsData_1 = require("./InvalidNewsData");
var cheerio = __importStar(require("cheerio"));
var Parser = /** @class */ (function () {
    function Parser(filePath) {
        this.filePath = filePath;
        this.rawContent = this.loadContent();
    }
    Parser.prototype.loadContent = function () {
        var data = fs_1.default.readFileSync(this.filePath);
        var decodedData = iconv_lite_1.default.decode(data, Parser.PRESS_ENCODING);
        return decodedData.replace(/<(\/span|span)([^>]*)>/gi, "").split(";");
    };
    Parser.prototype.createNews = function () {
        var id = this.parseId();
        var provider = this.parseProvider();
        var link = this.parseLink();
        var title = this.parseTitle();
        var content = this.parseContent();
        var writer = this.parseWriter();
        return new News_1.News(id, provider, link, title, content, writer);
    };
    Parser.prototype.parseId = function () {
        var id = null;
        for (var _i = 0, _a = this.rawContent; _i < _a.length; _i++) {
            var line = _a[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.NO) {
                id = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (id == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode NO in the XML file");
        }
        return id;
    };
    Parser.prototype.parseProvider = function () {
        var provider = null;
        for (var _i = 0, _a = this.rawContent; _i < _a.length; _i++) {
            var line = _a[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.SO) {
                provider = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (provider == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode SO in the XML file");
        }
        return provider;
    };
    Parser.prototype.parseLink = function () {
        var link = null;
        for (var _i = 0, _a = this.rawContent; _i < _a.length; _i++) {
            var line = _a[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.LU) {
                link = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (link == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode LU in the XML file");
        }
        return link;
    };
    Parser.prototype.parseTitle = function () {
        var title = null;
        for (var _i = 0, _a = this.rawContent; _i < _a.length; _i++) {
            var line = _a[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.TI) {
                title = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (title == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode TI in the XML file");
        }
        return title;
    };
    Parser.prototype.parseContent = function () {
        var _a;
        var content = null;
        for (var _i = 0, _b = this.rawContent; _i < _b.length; _i++) {
            var line = _b[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.TX) {
                content = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (content == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode TX in the XML file");
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
        var html = cheerio.load(content);
        html("a").remove();
        html("#relnews_list").remove();
        var htmlContent = (_a = html("body").html()) === null || _a === void 0 ? void 0 : _a.trim();
        if (htmlContent == undefined) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode TX in the XML file");
        }
        htmlContent = htmlContent.replace("<!-- r_start //--><!-- r_end //-->", "");
        htmlContent = htmlContent
            .replace(/^\%\NEW_LINE\%/, "")
            .replace("%NEW_LINE%%NEW_LINE%%NEW_LINE%%NEW_LINE% [ⓒ", "%NEW_LINE%%NEW_LINE%[ⓒ")
            .replace(/\[매일경제(.*)기자\] /gi, "")
            .replace(/\매경닷컴(.*)기자/gi, "");
        return htmlContent;
    };
    Parser.prototype.parseWriter = function () {
        var writer = null;
        for (var _i = 0, _a = this.rawContent; _i < _a.length; _i++) {
            var line = _a[_i];
            var code = line.substring(0, 2);
            if (code == NewsCode_1.NewsCode.WT) {
                writer = line.substring(2).replace(/\r\n$/, "").replace(/\n$/, "");
                break;
            }
        }
        if (writer == null) {
            throw new InvalidNewsData_1.InvalidNewsData("The news data is invalid, please check NewsCode WT in the XML file");
        }
        return writer;
    };
    Parser.PRESS_NAME = "매일경제";
    Parser.PRESS_CODE = "mk";
    Parser.PRESS_ID = 9;
    Parser.PRESS_DOMAIN = "mk.co.kr";
    Parser.PRESS_ENCODING = "euc-kr";
    Parser.NEW_LINE = "%NEW_LINE%";
    Parser.FLOAT_DOT = "%FLOAT_DOT%";
    Parser.PHOTO = "%PHOTO%";
    Parser.VIDEO = "%VIDEO%";
    return Parser;
}());
exports.Parser = Parser;
