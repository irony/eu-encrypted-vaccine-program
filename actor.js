const { generateKey, encrypt, decrypt, addRecipient } = require('./crypto.js')

// TODO: all data should be in signed JWE/JWTs
async function create(name) {
  const actor = {
    name,
    key: await generateKey(name),
    createParcel: async () => {
      const parcel = {
        destination: await encrypt(actor.key, 'Ann Andersson, Långhalmsvägen 312, 510 88'),
        sender: `${name}, Avsändargatan 1, 123 45`,
        events: [],
      }
      return parcel
    },
    addReader: (jwe, otherActor) => {
      return addRecipient(actor.key, jwe, otherActor.key)
    },
    receiveParcel: async (parcel) => {
      const desto = await decrypt(actor.key, parcel.destination)
      console.log(`${name} received a packet going to ${desto}`)

      parcel.events.push({
        timestamp: Date.now(),
        type: 'received',
        data: 'At sorting central Tomteboda',
      })
    }
  }
  return actor
}

module.exports = {
  create
}
