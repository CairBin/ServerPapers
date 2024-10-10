/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/http/IHttpServerHelper.ts - 帮助返回HttpServer的接口，用于依赖注入
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import http from 'http';
import https from 'https';
import http2 from "http2";

// 统一HttpServer的类型
export type HttpServer = https.Server | 
                         https.Server |
                         http2.Http2SecureServer|
                         http2.Http2Server|
                         http.Server;

export default interface IHttpServerHelper{
    getServer(): HttpServer;
    listen(port:number):void;
}