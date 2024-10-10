/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/logger/ILogger.ts - 日志记录器接口，用于依赖注入
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import {container} from '../InitDI';

export default interface ILogger{
    debug(msg:string):void;
    warn(msg:string):void;
    info(msg:string):void;
    error(msg:string):void;
    fatal(msg:string):void;
}

// 环绕日志方法装饰器
export function LogDebug(target:Object, propertyKey:string, descriptor: TypedPropertyDescriptor<any>){
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        let logger = container.get<ILogger>("ILogger");
        logger.debug(`Excuting method ${propertyKey}`);
        logger.debug(`Arguments: ${JSON.stringify(args)}`);
        let result = originalMethod.apply(this, args);
        
        if(result instanceof Promise)
            result.then((val:any)=>{
                logger.debug(`Result: ${val}`);
            }).catch((error:any)=>{
                logger.error(`Error: ${error}`);
            })
        else
            logger.debug(`Result: ${result}`);
        return result;
    }
}