# ServerPapers
ServerPapers is a lightweight server monitoring system.

## Deployment

### pm2

```shell
git clone https://github.com/CairBin/ServerPapers.git
```

Deploying projects using **pm2**,first you should install it.
```shell
npm install -g pm2
```
Enter project directory and edit `config.js` to set relevant configurations.
```shell
cd ServerPapers
```

* config.js
```js
//config.js
export default{
    host:{
        address:'localhost',
        port:8244
    },
    encryption:{
        algorithm:'aes-256-gcm',    //only support aes-256-gcm
    },
    clients:[
        {
            name:'Test',    //node name
            user:'test',
            pwd:'123456'
        }
    ]
}
```
The project currently only supports `aes-256-gcm`.

Enter commands to start the project.
```shell
npm install
pm2 start ecosystem.config.cjs
```
If you want to stop the program,you can execute this command.
```shell
pm2 stop ecosystem.config.cjs
```

## Web Page & Client


### Web Page
If you want to customize a web page, you can refer to the [CairBin/ServerPapers-Web](https://github.com/CairBin/ServerPapers-Web) project or place your own HTML file in the `./views` directory.

### Client
You need to deploy the client to the terminal device you want to listen to.
Please refer to [CairBin/ServerPapers-Client](https://github.com/CairBin/ServerPapers-Client).