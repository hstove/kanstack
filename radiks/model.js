import uuid from 'uuid/v4';
import * as blockstack from 'blockstack';
import merge from 'lodash.merge';

import { encryptObject } from './helpers';

export default class Model {
  static apiServer = null;

  static fromSchema(schema) {
    this.schema = schema;
    return this;
  }

  static defaults = {}

  static async fetch() {
    const request = await fetch(this.apiServerPath());
    return request.json();
  }

  constructor(attrs = {}) {
    const { schema, defaults } = this.constructor;
    this.schema = schema;
    this.uuid = attrs.uuid || uuid();
    this.attrs = merge({}, defaults, attrs);
  }

  hello() {
    console.log(this.schema);
  }

  async fetchSchema() {
    const { name } = this.schema;
    const url = `${this.constructor.apiServer}/radiks/models/${name}/schema`;
    console.log(url);
    const data = await request({ uri: url, json: true });
    return data;
  }

  save() {
    const encrypted = this.encrypted();
    return Promise.all([this.saveFile(encrypted), this.saveItem(), this.saveToRadiks(encrypted)]);
  }

  encrypted() {
    return encryptObject(this);
  }

  saveFile(encrypted) {
    console.log(this);
    // const data = encryptObject(this);
    // console.log(data);
    return blockstack.putFile(this.blockstackPath(), JSON.stringify(encrypted), { encrypt: false });
  }

  blockstackPath() {
    const path = `${this.schema.name}/${this.uuid}`;
    return path;
  }

  saveItem() {
    return new Promise(async (resolve, reject) => {
      try {
        const itemsPath = 'items';
        const filePath = this.blockstackPath();
        let items = await blockstack.getFile(itemsPath, { decrypt: false });
        console.log(items);
        items += `\n${filePath}`;
        resolve(await blockstack.putFile(itemsPath, items, { encrypt: false }));
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveToRadiks(encrypted) {
    console.log(encrypted);
    const filePath = this.blockstackPath();
    const attributes = merge({}, encrypted, { filePath });
    console.log('data for radiks', attributes);
    const url = this.apiServerPath();
    console.log(this.createdBy.username);
    const request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        attributes,
        username: this.createdBy.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return request.json();
  }

  apiServerPath(path) {
    return this.constructor.apiServerPath(path);
  }

  static apiServerPath(path) {
    let url = `${this.apiServer}/radiks/models/${this.schema.name}`;
    if (path) {
      url += `/${path}`;
    }
    return url;
  }
}
