/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/socket/SocketInitializer.ts - 创建SocketIO服务端，初始化相关配置并自动加载Handler
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */
import {Server} from 'socket.io'
import ISocketHandler from './ISocketHandler';
import ILogger from '../logger/ILogger';
import IHttpServerHelper from '../http/IHttpServerHelper';
import config from 'config';
import { injectable,inject, postConstruct } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import 'reflect-metadata';
import { container } from '../InitDI';
import ConnectHandler from '../handler/ConnectHandler';
import ClientHandler from '../handler/ClientHandler';
import Builder, { ISettings } from '../Builder';
import path from 'path';
import fs from 'fs';


@injectable()
export default class SocketInitializer{

    @inject("ILogger")
    private logger!:ILogger;
    @inject("IHttpServerHelper")
    private serverHelper!:IHttpServerHelper;

    private handlers:Array<ISocketHandler> = [];
    private io!:Server;
    private port!:number;
    // public isReady:boolean = false;


    // logger:ILogger, serverHelper:IHttpServerHelper
    constructor(){
        this.port = config.get<number>('port');
        // this.logger = logger;
        // this.serverHelper = serverHelper;
    }

    public use(handler:ISocketHandler):void{
        this.logger.info(`Added handler: ${handler.constructor.name}`);
        this.handlers.push(handler);
    }

    public onConnection():void{
        // while(!this.isReady);
        this.logger.info("Socket.IO server started");
        this.io = new Server(
            this.serverHelper.getServer(),  // Get the server from the container
            {cors:{
                origin:'*'
            }}
        );

        this.io.on('connection', (socket)=>{
            this.logger.info(`Socket connected: ${socket.id}`);
            this.handlers.forEach((handler:ISocketHandler)=>{
                handler.handle(this.io, socket);
            });
        });
    }

    public listen():void{
        this.logger.warn(`Socket listening on ${this.port}`);
        this.serverHelper.listen(this.port);
    }
}


// @Handler装饰器，利用反射标识类是一个Handler
export function Handler<T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata('cus:Handler',true,constructor);
    return constructor;

}

export class SocketSettings implements ISettings{
    loadSettings(builder:Builder):void{

        const socketInit = container.get<SocketInitializer>(SocketInitializer);
        // 获取事件监听器目录
        const handlerPath = path.resolve('./src/handler/');
        // 读取目录下所有模块
        fs.readdirSync(handlerPath).forEach(async (file)=>{
            // console.log(socketInit.isReady)
            const filePath = path.join(handlerPath, file);
            // 加载模块
            import(filePath).then((module)=>{
                for (const [key, value] of Object.entries(module)){
                    // 判断是否被@Handler修饰
                    let flag = Reflect.getMetadata('cus:Handler', value as any);
                    if(flag){
                        // 如果是则说明是一个监听器
                        const name = ((new (value as any)) as ISocketHandler).handlerName as string;
                        // 注入到IOC容器中
                        container.bind(name)
                            .to(value as any);
                        // 从容器中返回实例对象，并加载到clientInit中去
                        // 注意此处不能用new关键字，必须从容器返回
                        // 如果使用new则无法进行依赖注入
                        socketInit.use(
                            container.get<ISocketHandler>(name)
                        );
                    }
                }
                
            });
                      
        });
        // console.log(socketInit.isReady);
        // socketInit.isReady = true;
        socketInit.onConnection();  
        socketInit.listen();
    }
}