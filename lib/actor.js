const { generateKey, encrypt, decrypt, addRecipient } = require('./crypto.js')
const db = require('./db')
const shortid = require('shortid')

// TODO: all data should be in signed JWE/JWTs
async function create(name) {
  const actor = {
    name,
    key: await generateKey(name),
    createParcel: async () => {
      const parcel = {
        id: shortid.generate(),
        destination: await encrypt(actor.key, 'Ann Andersson, Långhalmsvägen 312, 510 88'),
        sender: `${name}, Avsändargatan 1, 123 45`,
        events: [],
      }
      return db.set('parcels', parcel.id, parcel)
    },
    addDestinationReader: async (id, otherActor) => {
      const parcel = await db.get('parcels', id)
      const updatedParcel = {...parcel, destination: addRecipient(actor.key, parcel.destination, otherActor.key)}
      return db.set('parcels', updatedParcel.id, updatedParcel)
    },
    receiveParcel: async (id) => {
      console.log('receiveParcel', id)
      const parcel = await db.get('parcels', id)
      console.log('parcel', parcel)

      const desto = await decrypt(actor.key, parcel.destination)
      console.log(`${name} received a packet going to ${desto}`)

      parcel.events.push({
        timestamp: Date.now(),
        type: 'received',
        data: 'At sorting central Tomteboda',
      })
      return db.set('parcels', id, parcel)
    }
  }
  return actor
}

module.exports = {
  create
}
