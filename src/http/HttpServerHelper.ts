/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/http/HttpServerHelper.ts - 帮助返回HttpServer，返回的具体内容取决于配置
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import IHttpServerHelper, { HttpServer } from "./IHttpServerHelper";
import config from 'config';
import http2 from 'http2';
import https from 'https';
import fs from 'fs';
import ILogger from "../logger/ILogger";
import { inject, injectable,postConstruct } from "inversify";
import "reflect-metadata";
import http from 'http';

@injectable()
export default class HttpServerHelper implements IHttpServerHelper {
    
    private logger!: ILogger;
    private server!:HttpServer;
    
    constructor(@inject("ILogger") logger:ILogger){
        this.logger = logger;
        const configObj = config.get<any>('https');
        if(!configObj || configObj.enable === false){
            this.server = http.createServer();
            this.logger.info("Created http server, version:1.0");
        }
        else {
            this.logger.info("Created https server, version:1.0");
            this.server = https.createServer({
                key: fs.readFileSync(configObj.keyPath),
                cert: fs.readFileSync(configObj.certPath),
            });
        }
    }
    
    public getServer(): HttpServer {
        return this.server;
    }

    listen(port: number): void {
        this.server.listen(port);
    }

}
