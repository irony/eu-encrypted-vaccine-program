const crypto = require('crypto')

class HashStorage {
  constructor (storage = new Map(), hashStorage = new Map()) {
    // default to in memory database
    this.storage = storage
    this.hashStorage = hashStorage
  }
  hash (value) {
    const hash = crypto.createHash('SHA256')
    const data = JSON.stringify(value)
    hash.update(data)
    return hash.digest('hex')
  }
  async set (scope, key, value) {
    const prev = await this.get(scope, key)
    if (prev && prev.hash && value.hash && prev.hash !== value.hash) return Promise.reject('Hash chain broken')
    const hash = this.hash(value)
    const obj = {...value, hash, prevHash: prev && prev.hash || null}
    if (prev && prev.hash === hash) return Promise.resolve() // don't save same object more than once
    this.storage.set(`${scope}/${key}`, obj)
    this.hashStorage.set(hash, obj)
    return Promise.resolve(obj)
  }
  get (scope, key) {
    return Promise.resolve(this.storage.get(`${scope}/${key}`))
  }
  getHistory (hash) {
    const history = []
    while (hash) {
      const obj = this.hashStorage.get(hash)
      history.push(obj)
      hash = obj && obj.prevHash
    }
    return Promise.resolve(history)
  }
}
module.exports = new HashStorage(new Map(), new Map())
