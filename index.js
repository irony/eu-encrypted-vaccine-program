(async () => {
  const { JWE, JWK } = require('node-jose')
  const actor = require('./actor.js')

  let zalando = await actor.create('Zalando')
  let postnord = await actor.create('Postnord')

  let package = await zalando.createParcel()
  console.log('recipients', package.destination.recipients)
  //console.log('package', package)
  //postnord.key = 0
  zalando.addReader(package.destination, postnord)
  console.log('recipients 2', package.destination.recipients)
  await postnord.receiveParcel(package)
  //await zalando.receiveParcel(package)
  console.log('package', package)
  // console.log('zalando key', zalando.key.toJSON())
  //console.log('postnord key', postnord.key.toJSON())
})()
