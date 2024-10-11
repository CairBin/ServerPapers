import {HashType} from '../src/crypto/IHash';

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
        // key为用户名，用于标识客户端
        test: {
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