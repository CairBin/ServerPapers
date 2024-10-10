/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/socket/ISocketHandler.ts - Handler接口，用于自动扫描加载Handler
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import {Server, Socket} from 'socket.io';

export default interface ISocketHandler{
    readonly handlerName:string;
    handle(io:Server, socket:Socket): void;
}