// Basic example, a parcel moving between two actors
// the sender and receiver can read the payload

(async () => {
  const actor = require('../lib/actor.js')
  
  let zalando = await actor.create('Zalando', 'parcels')
  let postnord = await actor.create('Postnord', 'parcels')
  let bob = await actor.create('Bob', 'parcels')

  let package = await zalando.create({ pickup: 'Zalando' })
  await zalando.addReader(package.id, postnord.key)

  const zalandoPayload = await zalando.read(package.id)
  console.log('Zalando can read the payload:', zalandoPayload)

  const payload = await postnord.read(package.id)
  console.log('Postnord can read the payload:', payload)
  
  try { await bob.read(package.id) }
  catch (e) { console.log('** Bob can not read the payload:', e.message) }

})()
