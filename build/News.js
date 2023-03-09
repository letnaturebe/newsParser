"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
/* eslint-disable no-console */
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
    return News;
}());
exports.News = News;
