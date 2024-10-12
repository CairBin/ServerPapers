/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/handler/ClientHandler.ts - 监听与客户端登陆以后的行为有关的事件
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";
import ISocketHandler from "../socket/ISocketHandler";
import ILogger from "../logger/ILogger";
import config from 'config'
import IHash from "../crypto/IHash";
import { Handler } from "../socket/SocketInitializer";

interface ClientMessage{
    user:string;
    token:string;
    data:Object;
}

class Client{
    token!:string;
}

@injectable()
@Handler
export default class ClientHandler implements ISocketHandler {
    
    @inject("ILogger")
    private logger!: ILogger;

    @inject("IHash")
    private hashHelper!: IHash;
    
    private clientMapper!:Map<string, Client>;

    readonly handlerName: string = 'ClientHandler';

    constructor(){
        this.clientMapper = new Map(Object.entries(
            config.get<Client>("clients")
        ));
    }

    handle(io: Server, socket: Socket): void {
        const onClientData = (message:ClientMessage) =>{
            try{
                let flag = this.hashHelper.compare(
                    this.clientMapper.get(message.user)?.token,
                    message.token
                );

                this.logger.debug(`${JSON.stringify(message)}`)
                if(!flag) return;
                socket.to("web").emit("clientInfo", {
                    user:message.user,
                    data:message.data
                });
                

            }catch(error){
                this.logger.info(`Error processing data, ${socket.id}`);
            }
        }

        socket.on('clientData', onClientData);
    }

}