/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/Builder.ts - 用于加载配置并启动程序
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

// 每个需要初始化的模块都应当实现该接口并在app.ts调用
export interface ISettings{
    loadSettings(builder:Builder):void;
}

export default class Builder{
    private settings:Array<ISettings>;
    
    constructor(){
        this.settings = [];
    }

    public use(settings:ISettings):Builder{
        this.settings.push(settings);
        return this;
    }

    public run():void{
        this.settings.forEach((item)=>{
            item.loadSettings(this);
        })
    }
}