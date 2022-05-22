const actor = require('../lib/actor.js')

test('actor can not read parcel destination before being added as reader', async () => {
  expect.assertions(1)

  const zalando = await actor.create('Zalando', 'parcels')
  const postnord = await actor.create('Postnord', 'parcels')
  const parcel = await zalando.createObject({ pickup: 'Zalando' })

  await expect(postnord.readPayload(parcel.id))
    .rejects.toMatchObject(new Error('no key found'))
})

test('actor can receive parcel after being added as reader', async () => {
  expect.assertions(1)

  const zalando = await actor.create('Zalando', 'parcels')
  const postnord = await actor.create('Postnord', 'parcels')
  const parcel = await zalando.createObject({ pickup: 'Zalando' })

  await zalando.addPayloadReader(parcel.id, postnord)

  await expect(postnord.readPayload(parcel.id))
    .resolves.toBeDefined()
})
