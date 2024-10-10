# ServerPapers

## 描述

一个基于SocketIO的服务器监听面板。SeverPapers的服务端，用于监听来自客户端（被监听的主机）的事件，并将内存、网络、硬盘、CPU、系统等信息转发前端。

客户端请参考[SeverPapers--github.com](https://github.com/CairBin/ServerPapers-Client)

## 注意

此项目与之前JS版本不兼容，请配合相应版本的客户端和Web。
在之前的JS版本中，客户端到服务端之间的链路使用对称加密，在

此版本中不再支持对称加密算法，其数据的机密性应当由HTTPS协议保证，如果使用HTTP协议将以明文发送数据。

关于TLS/SSL证书，可以在配置文件中进行设置。
可以使用加载文件的方式进行证书配置（主要为了支持自签名证书），或者使用HTTP协议然后通过Nginx反向代理后配置HTTPS。


此版本要求前端必须提交口令才能获取数据。另外对于Web页面与服务端进行了前后端分离，Web侧需要单独进行部署，不再使用Express框架（暂定）。


## 配置文件

该项目使用了`config`库，在`./config/default.ts`中进行相关配置：

相关字段解释请参考注释：

```ts
export default{
    port: 8892, // 监听端口
    https: {
        enable: false,  // 是否使用HTTPS，false则不加载证书使用HTTP
        // 私钥文件，请获取或者用OpenSSL生成
        keyPath: '/Users/cairbin/Others/program/nodejs/sp/server/certificate/key.pem',
        // 证书
        certPath: '/Users/cairbin/Others/program/nodejs/sp/server/certificate/cert.pem',
    },
    clients:{   // 客户端
        test: {
            username:'test',    // 用户名，用于标识客户端
            token: '123456'     // 每次接受信息需要验证的口令
        }
    },
    websites:{  // web端符合条件的会加入广播组
        web1:{
            url: 'http://localhost:8892',   // URL地址仅描述暂无实质用处
            token: '123456',                // 登陆口令
            description:'Local host'        // 描述
        }
    },
    hash:HashType.SM3,  // 口令所需的Hash算法类型
}
```

## 运行

请先安装`yarn`:
```sh
npm install yarn -g
```

首先安装项目所需依赖，此命令会安装`./package.json`中声明的所有包：

```sh
yarn install
```

### 开发环境

开发环境下你可以在项目根目录下使用以下命令启动项目:

```sh
yarn start
```


### 正式环境

项目采用PM2进行部署，在此之前请确保PM2已被安装

``` sh
yarn global add pm2
```

如果yarn全局安装的包找不到，可以使用以下命令来查询目录
```sh
yarn global bin
```

**请手动并把输出的目录添加到系统环境变量中。**

将typescript添加到PM2
```sh
pm2 install typescript
```

使用PM2启动项目

```sh
pm2 start ecosystem.config.js
```

之后可以使用名称来管理项目状态
```sh
pm2 stop ServerPapers
pm2 start ServerPapers
```


## 开发

### 事件

服务端监听`hello`事件，该事件可能来自客户端或者WEB，用一个标识符区分它们。
对于WEB，登陆验证口令后会加入`web`广播组；而对于客户端，则发送一个不带消息的`ready`事件，通知客户端发送硬件信息。
`hello`事件接收的格式如下：

```ts
enum Flag{
    WEB = "web",
    CLIENT = "client",
    REPEATER = "repeater"   // 中继，暂未实现
}

interface HelloMessage{
    flag:string;    // 对应Flag，标识符，区分客户端还是服务端
    token:string;   // 口令的哈希值，应当与配置文件口令hash运算后一致
    data:string;    // 携带的数据（目前暂定为空字符串）
    user:string;    // 用户名
}
```

对于`ready`事件，接收的消息如下：
```ts
interface ClientMessage{
    user:string;    // 区分客户端
    token:string;   // 用于每次消息认证
    data:Object;    // 客户端硬件数据
}
```


### 依赖注入

本项目使用了inversifyJS框架用于以依赖注入的方式实现IOC，其注入相关的信息与`./src/CustomDI`下

详细请参考[inversifyJS-Github](https://github.com/inversify/InversifyJS
)

按照项目规范，服务提供者应当实现接口并在`./src/InitDI`中进行注入配置。


### 模块初始化

本项目要求统一使用Builder来进行相关模块加载，`./src/Builder.ts`中定义了`ISettings`接口。

```ts
export interface ISettings{
    loadSettings(builder:Builder):void;
}
```

在需要初始化的模块文件中定义实现该接口的类
```ts
export class MySettings implements ISettings{
    loadSettings(builder:Builder):void{
        [...]
    }
}
```

然后在`./src/app.ts`中按照加载顺序调用

```ts
[...]
builder.use(new MySettings);
[...]
builder.run();
```

### Handler


`./src/socket/SocketInitializer.ts`中代码会自动扫描`./handler/`下所有模块文件然后自动从容器中加载，请将新的Handler放置在该目录下，并实现`ISocketHandler`接口，添加`@Handler`装饰器，并初始化`handler`属性，该属性用于依赖注入。





## 第三方库

列举主要使用的第三方库（并非全部）

* 依赖注入[inversifyJS--github.com](https://github.com/inversify/InversifyJS)
* 密码学相关算法crypto
* 配置文件管理[config--www.npmjs.com](https://www.npmjs.com/package/config)
* 日志记录器[pino--github.com](https://github.com/pinojs/pino)
* SocketIO