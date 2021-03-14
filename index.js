(async () => {
  const db = require('./db')
  const actor = require('./actor')

  const person = { name: 'Christian Landgren', pnr: '1212121212' }

  const sweden = await actor.create('Sweden')
  const denmark = await actor.create('Denmark')
  const self = await actor.create('Self')

  const vaccination = await sweden.vaccinate(person, 'Anonyn data som verifierar vaccinationen')
  await sweden.addReader(vaccination.id, denmark)
  await sweden.addReader(vaccination.id, self)

  // print the keys
  const qr = vaccination.id
  console.log('Red Key', JSON.stringify(self.key, null, 2))
  console.log('Black Key', `https://vaccinationledger.eu/${qr}`)
  console.log('Green Key', vaccination.encrypted.ciphertext)

  // at a separate place,
  const verify = await denmark.readVaccination(qr, 'Gränskontrollen Sverige till Danmark')
  console.log('DENMARK VERIFIES', JSON.stringify(verify, null, 2))

  // person can also verify the log offline if they save their own key on-device
  const proof = await self.readVaccination(qr, 'Jag hämtar mitt eget bevis')
  console.log('PROOF:', JSON.stringify(proof, null, 2))

  // anonymous users can read the contents and verify that the proof is still valid
  const anon = await db.get('vaccinations', qr)
  console.log('LEDGER:', JSON.stringify(anon, null, 2))

  // revoke a vaccination ID
  await sweden.revoke(qr)
  const revoked = await db.get('vaccinations', qr)
  console.log('valid?', revoked.valid)
})()
