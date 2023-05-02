import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import config from './config.js'
import {SymEncryption,Hash} from './utils/hash/index.js'

//routes
import indexRoute from './routes/indexRoute.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{})
const symEncry = new SymEncryption(config.encryption)

app.use(express.static('./views'))
app.use('/',indexRoute)

const mapper = new Map()
config.clients.forEach((item) => {
    mapper.set(item.name,{status:'outline',info:null})
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
                    if(data.pwd == item.pwd){
                        mapper.set(item.name, {
                            status: 'online',
                            info:data.message
                        })
                    }
                }
                catch(e){

                }
            }
        })
    })
})

httpServer.listen(config.host.port)