(async () => {
  const actor = require('./actor.js')

  let zalando = await actor.create('Zalando')
  let postnord = await actor.create('Postnord')

  let package = await zalando.createParcel()
  await zalando.addDestinationReader(package.id, postnord)
  const updatedPackage = await postnord.receiveParcel(package.id)
  console.log('package', updatedPackage)
})()
