/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/crypto/IHash.ts - 哈希算法接口和类型
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

export enum HashType{
    MD5,
    SHA256,
    SM3
}

export default interface IHash{

    compare(text?:string, hashVal?:string):boolean;

    hash(text:string):string;
}