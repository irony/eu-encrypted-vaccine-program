const { generateKey, encrypt, decrypt, addRecipient, removeRecipient } = require('./crypto.js')
const db = require('./db')
const shortid = require('shortid')

// TODO: all data should be in signed JWE/JWTs
async function create(name, namespace = 'default') {
  const actor = {
    name,
    key: await generateKey(name),
    create: async (payload) => {
      const parcel = {
        id: shortid.generate(),
        payload: await encrypt(actor.key, JSON.stringify(payload)),
        owner: name,
        events: [],
      }
      return db.set(namespace, parcel.id, parcel)
    },
    addReader: async (id, key) => {
      const parcel = typeof id === 'string' ? await db.get(namespace, id) : id
      const updatedParcel = {...parcel, payload: addRecipient(actor.key, parcel.payload, key)}
      return db.set(namespace, updatedParcel.id, updatedParcel)
    },
    removeReader: async (id, key) => {
      const parcel = typeof id === 'string' ? await db.get(namespace, id) : id
      const updatedParcel = {...parcel, payload: removeRecipient(actor.key, parcel.payload, key)}
      return db.set(namespace, updatedParcel.id, updatedParcel)
    },
    read: async (id) => {
      const parcel = await db.get(namespace, id)
      const payload = await decrypt(actor.key, parcel.payload)

      parcel.events.push({
        timestamp: Date.now(),
        type: 'read',
        by: actor.name,
      })
      await db.set(namespace, id, parcel)
      return payload
    }
  }
  return actor
}

module.exports = {
  create
}
