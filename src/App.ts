/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/App.ts - 程序入口
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */


import {DISettings} from './InitDI';
import {SocketSettings} from './socket/SocketInitializer';
import Builder from './Builder';


const builder = new Builder();
builder.use(new DISettings)
    .use(new SocketSettings)
    .run();
