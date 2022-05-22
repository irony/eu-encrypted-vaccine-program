const { generateKey, encrypt, decrypt, addRecipient } = require('./crypto.js')
const db = require('./db')
const shortid = require('shortid')

// TODO: all data should be in signed JWE/JWTs
async function create(name, namespace = 'default') {
  const actor = {
    name,
    key: await generateKey(name),
    createObject: async (payload) => {
      const parcel = {
        id: shortid.generate(),
        payload: await encrypt(actor.key, JSON.stringify(payload)),
        owner: name,
        events: [],
      }
      return db.set(namespace, parcel.id, parcel)
    },
    addPayloadReader: async (id, otherActor) => {
      const parcel = await db.get(namespace, id)
      const updatedParcel = {...parcel, payload: addRecipient(actor.key, parcel.payload, otherActor.key)}
      return db.set(namespace, updatedParcel.id, updatedParcel)
    },
    readPayload: async (id) => {
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
