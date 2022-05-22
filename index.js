(async () => {
  const actor = require('./lib/actor.js')

  let zalando = await actor.create('Zalando', 'parcels')
  let postnord = await actor.create('Postnord', 'parcels')

  let package = await zalando.createParcel()
  await zalando.addPayloadReader(package.id, postnord)
  const updatedPackage = await postnord.receiveParcel(package.id)
  console.log('package', updatedPackage)
})()
