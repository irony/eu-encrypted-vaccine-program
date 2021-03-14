const { generateKey, encrypt, decrypt, addRecipient, generateId } = require('./crypto.js')
const db = require('./db')

async function create (name) {
  const actor = {
    name,
    key: await generateKey(name),
    vaccinate: async (person, proof) => {
      const id = generateId()
      const vaccination = {
        id,
        encrypted: await encrypt(actor.key, JSON.stringify({ id, person, proof }, null, 2)),
        authority: name,
        valid: true,
        proof,
        date: new Date().toISOString()
      }
      return db.set('vaccinations', vaccination.id, vaccination)
    },
    revoke: async (id) => {
      const vaccination = await db.get('vaccinations', id)
      vaccination.valid = false
      return db.set('vaccinations', id, vaccination)
    },
    addReader: async (id, otherActor) => {
      const vaccination = await db.get('vaccinations', id)
      const updatedVaccination = {
        ...vaccination,
        encrypted: addRecipient(actor.key, vaccination.encrypted, otherActor.key)
      }
      return db.set('vaccinations', id, updatedVaccination)
    },
    readVaccination: async (id, details) => {
      const vaccination = await db.get('vaccinations', id)
      if (!vaccination.valid) throw new Error('Vaccination is not valid!')
      const decrypted = await decrypt(actor.key, vaccination.encrypted)
      // console.log(`${name} verified a vaccination for ${decrypted.person.name}`)
      // await db.set('vaccinations', id, vaccination)
      return decrypted
    }
  }
  return actor
}

module.exports = {
  create
}
