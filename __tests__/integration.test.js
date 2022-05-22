const actor = require('../lib/actor.js')

test('actor can not read parcel destination before being added as reader', async () => {
  expect.assertions(1)

  const zalando = await actor.create('Zalando', 'parcels')
  const postnord = await actor.create('Postnord', 'parcels')
  const parcel = await zalando.create({ pickup: 'Zalando' })

  await expect(postnord.read(parcel.id))
    .rejects.toMatchObject(new Error('no key found'))
})

test('actor can receive parcel after being added as reader', async () => {
  expect.assertions(1)

  const zalando = await actor.create('Zalando', 'parcels')
  const postnord = await actor.create('Postnord', 'parcels')
  const parcel = await zalando.create({ pickup: 'Zalando' })

  await zalando.addReader(parcel.id, postnord.key)

  await expect(postnord.read(parcel.id))
    .resolves.toBeDefined()
})
