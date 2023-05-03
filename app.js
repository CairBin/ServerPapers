import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import config from './config.js'
import {SymEncryption,Hash} from './utils/hash/index.js'

//routes
import indexRoute from './routes/indexRoute.js'
import { Socket } from 'dgram'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: true
})
const symEncry = new SymEncryption(config.encryption)

app.use(express.static('./views'))
app.use('/',indexRoute)

const mapper = new Map()
config.clients.forEach((item) => {
    mapper.set(item.name,{name:item.name,status:'outline',info:null})
})

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
                    console.log(data.message)
                    if (data.pwd == item.pwd) {
                        var sendMsg = {
                            name: item.name,
                            id:sock.id,
                            status: 'online',
                            info:data.message
                        }
                        mapper.set(item.name,sendMsg)
                        sock.to('web').emit('flashInfo', Object.fromEntries(mapper))
                    }
                    
                }
                catch(e){

                }
            }
        })
    })

    sock.on('initList', (res) => {
        console.log(res)
        sock.emit('recvList', Object.fromEntries(mapper))
        sock.join('web')
    })

    sock.on('disconnect', () => {
        console.log(sock.id, 'disconnected!')
        mapper.forEach((item) => {
            if (item.id == sock.id) {
                item.status = 'offline'
                mapper.set(item.name,item)
            }
        })
        sock.to('web').emit('flashInfo', Object.fromEntries(mapper))
    })

    sock.on('live', () => {
        sock.join('web')
        sock.emit('stopLive')
    })
})

httpServer.listen(config.host.port)