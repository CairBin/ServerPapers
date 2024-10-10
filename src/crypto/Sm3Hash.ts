/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/crypto/Sm3Hash.ts - SM3 Hash
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import IHash from "./IHash";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import crypto from 'crypto';

@injectable()
export default class Sm3Hash implements IHash {
    hash(text: string): string {
        const hash = crypto.createHash('SM3')
            .update(text)
            .digest('base64');
        return hash;
    }

    compare(text?:string, hashVal?:string):boolean{
        if(!text || !hashVal)
            return false;
        return this.hash(text) === hashVal;
    }
}