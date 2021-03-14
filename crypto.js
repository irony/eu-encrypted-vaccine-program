const { JWK, JWE } = require('node-jose')
const { generate } = require('shortid')
const { privateDecrypt, publicEncrypt } = require('crypto')

// RFC 4648 - filename safe base encoding
const base64url = (stuff) => (Buffer.from(stuff)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

function generateId () {
  return generate()
}

async function generateKey (keyId) {
  return await JWK.createKeyStore().generate('RSA', 1024, { kid: keyId })
}

async function encrypt (key, data) {
  // TODO: does this work if data is an object?
  return await JWE.createEncrypt(key).update(data, 'utf-8').final()
}

async function decrypt (key, jwe) {
  return JSON.parse((await JWE.createDecrypt(key).decrypt(jwe)).payload.toString())
}

function addRecipient (oldRecipient, jwe, newRecipient) {
  let cek
  for (const recipient of jwe.recipients) {
    try {
      cek = privateDecrypt(oldRecipient.toPEM(true), Buffer.from(recipient.encrypted_key, 'base64'))
      break
    } catch (error) {
      // keep trying if we get the expected error from key not matching
      if (error.message !== 'error:04099079:rsa routines:RSA_padding_check_PKCS1_OAEP_mgf1:oaep decoding error') {
        throw error
      }
    }
  }
  if (!cek) {
    throw new Error('Could not unlock CEK. Key is not a recipient.')
  }

  const newRecipientCekEncrypted = base64url(publicEncrypt(newRecipient.toPEM(), cek))
  jwe.recipients.push({
    // Is there a point to using the per-recipient unprotected header?
    header: {
      kid: newRecipient.kid
      // alg: 'RSA-OAEP'
    },
    encrypted_key: newRecipientCekEncrypted
  })
  // TODO: don't mutate input
  return jwe
}

module.exports = {
  generateId,
  generateKey,
  encrypt,
  decrypt,
  addRecipient
}
