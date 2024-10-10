/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/Logger/PinoLogger.ts - pino对ILogger的实现
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import pino from 'pino';
import dayjs from 'dayjs';
import ILogger from './ILogger';
import { provide } from 'inversify-binding-decorators';
import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
export default class PinoLogger implements ILogger {
    private logger = pino({
        transport:{
            target: 'pino-pretty',
        },
        base:{
            pid: false,
        },
        timestamp: () => dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    public debug(msg: string): void {
        this.logger.debug(msg);
    }
    
    public warn(msg: string): void {
        this.logger.warn(msg);
    }
    
    public info(msg: string): void {
        this.logger.info(msg);
    }
    
    public error(msg: string): void {
        this.logger.error(msg);
    }

    public fatal(msg:string):void{
        this.logger.fatal(msg);
    }
}

