const crypto = require('../lib/crypto')

test('the basic crypto functions work as expected', async () => {
  expect.assertions(5)

  const firstRecipient = await crypto.generateKey('first')
  const secondRecipient = await crypto.generateKey('second')
  await expect(firstRecipient).not.toMatchObject(secondRecipient)

  const someData = 'Twas brillig, and the slithy toves did gyre and gimble in the wabe'
  let encryptedData = await crypto.encrypt(firstRecipient, someData)
  await expect(crypto.decrypt(firstRecipient, encryptedData))
    .resolves.toMatch(someData)
  await expect(crypto.decrypt(secondRecipient, encryptedData))
    .rejects.toMatchObject(new Error('no key found'))

  const encryptedData2 = await crypto.addRecipient(firstRecipient, encryptedData, secondRecipient)
  await expect(crypto.decrypt(firstRecipient, encryptedData2))
    .resolves.toMatch(someData)
  await expect(crypto.decrypt(secondRecipient, encryptedData2))
    .resolves.toMatch(someData)
})

test('addRecipient works even if the decrypting key is not the first recipient', async () => {
  expect.assertions(1)

  const firstRecipient = await crypto.generateKey('first')
  const secondRecipient = await crypto.generateKey('second')
  const thirdRecipient = await crypto.generateKey('third')

  const someData = 'Twas brillig, and the slithy toves did gyre and gimble in the wabe'
  let encryptedData = await crypto.encrypt(firstRecipient, someData)

  const encryptedData2 = await crypto.addRecipient(firstRecipient, encryptedData, secondRecipient)
  const encryptedData3 = await crypto.addRecipient(secondRecipient, encryptedData2, thirdRecipient)

  await expect(crypto.decrypt(thirdRecipient, encryptedData3))
    .resolves.toMatch(someData)
})

test('addRecipient throws if key is not a recipient', async () => {
  expect.assertions(1)

  const recipient = await crypto.generateKey('first')
  const someData = 'Twas brillig, and the slithy toves did gyre and gimble in the wabe'
  let encryptedData = await crypto.encrypt(recipient, someData)

  let error
  try {
    // some random keys
    const someKey = await crypto.generateKey('second')
    const someOtherKey = await crypto.generateKey('third')

    // should not work as someKey is not a recipient
    crypto.addRecipient(someKey, encryptedData, someOtherKey)
  } catch (e) {
    error = e
  }
  expect(error).toBeDefined()
})
