/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/InitDI.ts - 初始化DI容器
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import ILogger from "./logger/ILogger";
import PinoLogger from "./logger/PinoLogger";
import IHttpServerHelper from "./http/IHttpServerHelper";
import HttpServerHelper from "./http/HttpServerHelper";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import { Container} from "inversify";
import SocketInitializer from "./socket/SocketInitializer";
import 'reflect-metadata';
import config from 'config';
import IHash, { HashType } from "./crypto/IHash";
import Md5Hash from "./crypto/Md5Hash";
import Sha256Hash from "./crypto/Sha256Hash";
import Sm3Hash from "./crypto/Sm3Hash";
import Builder, {ISettings} from './Builder';

export const container = new Container();

export class DISettings implements ISettings{
    loadSettings(builder: Builder): void {
        container.bind<SocketInitializer>(SocketInitializer)
        .to(SocketInitializer)
        .inSingletonScope();

        container.bind<ILogger>("ILogger")
        .to(PinoLogger)
        .inSingletonScope();

        container.bind<IHttpServerHelper>("IHttpServerHelper")
        .to(HttpServerHelper);

        const hashType = config.get<HashType>("hash");
        switch(hashType){
            case HashType.MD5:
                container.bind<IHash>("IHash")
                .to(Md5Hash).inSingletonScope();
                break;
            case HashType.SHA256:
                container.bind<IHash>("IHash")
                .to(Sha256Hash);
                break;
            default:
                container.bind<IHash>("IHash")
                .to(Sm3Hash);
                break;
        }
    }
    
}
