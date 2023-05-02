import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import config from './config.js'
import {SymEncryption,Hash} from './utils/hash/index.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{})

const symEncry = new SymEncryption(config.encryption)

io.on('connection',(sock)=>{
    console.log(sock.id)
    sock.on('info',(res)=>{
        var pack = res.pack
        var user = res.user
        config.clients.forEach((item)=>{
            if(item.user == user)
            {
                try{
                    var data = JSON.parse(symEncry.decode(pack,Hash.Md5(item.pwd)))
                    if(data.pwd == item.pwd){
                        console.log(data.message)
                    }
                }
                catch(e){

                }
            }
        })
    })
})

httpServer.listen(config.host.port)