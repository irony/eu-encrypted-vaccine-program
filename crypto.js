const { JWK, JWE } = require('node-jose')
const { privateDecrypt, publicEncrypt } = require('crypto')

//RFC 4648 - filename safe base encoding
const base64url = (stuff) => (Buffer.from(stuff)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

async function generateKey(keyId) {
  return await JWK.createKeyStore().generate('RSA', 1024, { kid: keyId } )
}

async function encrypt(key, data) {
  // TODO: does this work if data is an object?
  return await JWE.createEncrypt(key).update(data, 'utf-8').final()
}

async function decrypt(key, jwe) {
  // TODO: this definitely doesn't work with objects :D
  return (await JWE.createDecrypt(key).decrypt(jwe)).payload.toString()
}

function addRecipient(oldRecipient, jwe, newRecipient) {
  // TODO: stop assuming we are the first recipient
  const oldRecipientCekEncrypted = jwe.recipients[0].encrypted_key
  const cek = privateDecrypt(oldRecipient.toPEM(true), Buffer.from(oldRecipientCekEncrypted, 'base64'))
  const newRecipientCekEncrypted = base64url(publicEncrypt(newRecipient.toPEM(), cek))
  jwe.recipients.push({
     // Is there a point to using the per-recipient unprotected header?
    header: {
      kid: newRecipient.kid,
      // alg: 'RSA-OAEP'
    },
    encrypted_key: newRecipientCekEncrypted
  })
  // TODO: mutate input or return copy?
  return jwe
}

module.exports = {
  generateKey,
  encrypt,
  decrypt,
  addRecipient,
}
