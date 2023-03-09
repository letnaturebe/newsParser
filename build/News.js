"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
/* eslint-disable no-console */
var fs_1 = __importDefault(require("fs"));
var News = /** @class */ (function () {
    function News(id, provider, link, title, content, writer) {
        this._id = id;
        this._provider = provider;
        this._link = link;
        this._title = title;
        this._content = content;
        this._writer = writer;
    }
    Object.defineProperty(News.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(News.prototype, "provider", {
        get: function () {
            return this._provider;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(News.prototype, "link", {
        get: function () {
            return this._link;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(News.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(News.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(News.prototype, "writer", {
        get: function () {
            return this._writer;
        },
        enumerable: false,
        configurable: true
    });
    News.prototype.checkData = function () {
        console.log("Title:", this.title);
        console.log("Provider:", this.provider);
        console.log("Link:", this.link);
        console.log("Content:", this.content);
        console.log("Writer:", this.writer);
    };
    News.prototype.createFile = function () {
        if (fs_1.default.existsSync(News.FILE_PATH)) {
            fs_1.default.unlink(News.FILE_PATH, function (err) {
                if (err) {
                    return;
                }
            });
        }
        fs_1.default.writeFile(News.FILE_PATH, this.content, function (err) {
            if (err)
                throw err;
        });
    };
    News.FILE_PATH = "result.txt";
    return News;
}());
exports.News = News;
