/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/handler/ConnectHandler.ts - 监听处理连接与登陆相关的事件
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */


import { Server, Socket } from "socket.io";
import ISocketHandler from "../socket/ISocketHandler";
import ILogger from "../logger/ILogger";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import IHash from "../crypto/IHash";
import config from 'config';
import { Handler } from "../socket/SocketInitializer";

enum Flag{
    WEB = "web",
    CLIENT = "client",
    REPEATER = "repeater"
}

interface HelloMessage{
    flag:string;
    token:string;
    data:string;
    user:string;
}

class Client{
    token!:string;
}

class Website{
    url!:string;
    description!:string;
    token!:string;
}

@injectable()
@Handler
export default class ConnectHandler implements ISocketHandler{

    readonly handlerName: string = 'ConnectHandler';

    @inject("ILogger")
    private logger!: ILogger;

    @inject("IHash")
    private hashHelper!: IHash;

    private clientMapper!:Map<string, Client>;
    private webMapper!:Map<string, Website>;

    constructor(){
        this.clientMapper = new Map(Object.entries(
            config.get<Client>("clients")
        ));

        this.webMapper = new Map(Object.entries(
            config.get<Website>("websites")
        ));
    }

    handle(io: Server, socket: Socket): void {
        const onHello = (message:HelloMessage)=>{
            this.logger.info(`Received hello request`);

            try{
                if(!message) return;
                if(message.flag && message.flag == Flag.WEB){
                    this.logger.info(`Web try to login`);
                    let flag:boolean = this.hashHelper.compare(
                        this.webMapper.get(message.user)?.token,
                        message.token
                    );

                    if(!flag){
                        this.logger.info(`Token error`);
                        socket.disconnect();
                        return;
                    }
                    socket.join('web');
                    this.logger.info(`Connected to website ${message.user}, ${socket.id}`);

                
                }else if(message.flag && message.flag == Flag.CLIENT){
                    this.logger.info(`Client '${socket.id}' try to login`);
                    let flag:boolean = this.hashHelper.compare(
                        this.clientMapper.get(message.user)?.token,
                        message.token
                    );
                    
                    if(!flag){
                        this.logger.info(`Token error`);
                        socket.disconnect();
                        return;
                    } 
                    socket.emit("ready");

                    this.logger.info(`Connected to client ${message.user}, ${socket.id}`);
                }else{
                    this.logger.info("Invalid flag");
                    socket.disconnect();
                }

            }catch{
                this.logger.info(`Error formatting message, ${socket.id}`);
            }
            
        }

        socket.on("hello", onHello);
        socket.on("disconnect",()=>{
            this.logger.info(`Socket disconnected ${socket.id}`);
        });
    }
}