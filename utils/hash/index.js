import crypto from 'crypto'

export class SymEncryption{
    constructor(encryInfo){
        this.algorithm = encryInfo.algorithm
    }

    decode(obj,key){
        const decipher = crypto.createDecipheriv(this.algorithm, key, obj.iv); // 初始化解密算法
        decipher.setAuthTag(obj.tag)
        let decrypted = decipher.update(obj.data, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }
}

export class Hash{
    static Md5(text){
        return crypto.createHash('md5').update(text).digest('hex')
    }
}