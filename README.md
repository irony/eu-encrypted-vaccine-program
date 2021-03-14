Suggestion for Encrypted Decentralised European Digital Vaccine Registry
===

## Abstract
We suggest using JWK and JWE encryption and QR-codes as methods to securely issue proofs of vaccination that works both online and offline and with or without access to Internet.

## Desired characteristics
When a citizen gets vaccinated they need to be able to prove their vaccination to authorities in a secure way without any risk of having to expose their private information into a centralized database or having their moving patterns exposed to outside parties. At the same time the authorities need a robust and fast way to verify these signatures without any risk of bottlenecks if internet access is lost. Also it needs to be user friendly so everyone understands the process.
To summarize the characteristics:
1. Robust and secure
2. Fast and resilient
3. User friendly
4. Non invasive

## Proposed Solution
A user ‘Alice’ walks into a vaccine clinic in Stockholm. She gets her second Covid Vaccine shot from clerk Bob and before doing so the personnel checks her photo ID. Bob opens up the EU Vaccine app, logs in with the clinic ID and scans their issued paper key and creates a new Vaccination in the app. Bob enters the Name and ID from Alice's photo ID in the app. At this time stores the proof encrypted on the EU ledger and also prints three QR codes:
  

![image](https://user-images.githubusercontent.com/395843/111073489-2cda2780-84df-11eb-8955-45215503af46.png)
1. The Black Key. The verifiable key for Alice Vaccination ID on the ledger.

![image](https://user-images.githubusercontent.com/395843/111073496-3a8fad00-84df-11eb-801a-b705b4df2e98.png)
2. Alice’s Red Key. The red key is Alice’s paper key and can be used to verify her in the EU vaccination app. This key is secure and should never be shared with anyone.

![image](https://user-images.githubusercontent.com/395843/111073507-4a0ef600-84df-11eb-83eb-60fc7efdd789.png)
3. The Green key. Contains encrypted data that can be shared with authorities at any time to prove her vaccination status. This green QR-code contains the proof of vaccination, Alice’s ID and name. It can be read by anyone with the corresponding encryption keys.

## Usage
Whenever Alice wants to prove her vaccination result she can choose between multiple different options to prove her vaccination status.
1. Anonymously through the black QR code. This code can be viewed by anyone with their mobile phone. It does not prove her identity or reveal anything about Alice except the date and anonymous proof of the vaccination. It does not contain any data except for the Vaccination ID. The rest of the information can be downloaded from the public ledger. 
2. Securely by using her phone. The Red key used to identify Alice in the clinic can be used to issue a one time encrypted QR-code that both can identify Alice and her vaccination result to someone else with their app (by scanning their code). This can be done offline with two apps using their keys only using the camera.
3. Offline to authorities without any phone or internet using the Green Key. This key can be read by selected authorities using their private encryption keys. The green key can also be read using Alice’s Red key offline.

## Implementation details

- Red Keys
This is an example of a Red Key (JWK).

    {"kty": "RSA","kid": "Self","e": "AQAB", "n": "nx4QJsKSpYDcBYz-aOvm9iQCPbqbLU9Tuk4OEDchVG844QOq_zQPDAvnlNvvzznVdDRgKczN9FrMBFIwuBgUQVCVbVS6zsGzGe7_ZTlvmjbI5MZ3OUi0GgTP2fHZHQ3QAm6RmPKb8be_OB-4TpDnMo_LsHRDi83T-CA6rU9nNs8"}


- Green Keys
This is the ciphertext from the Green Key. It can be read both by the Red Key of Alice or by the authorities with valid keys. 

```           VxW5xmH_IzmirVpG4aJML3PPYsybSYdulXI7irG163wTwUJQhBuHyw20cfezfwq8Qj8YLtjLwjZlJbadFuAz6ehp3tt4u20pd1MdTVIHa3gYPL-19oPYDOmH5HCMuepDa1J6MfcydDx0EbQY2h5sRP1XUUxWXlaAxxZbijHxwj_SIdlgfrIhnBIK2B01ACEf6a7MCf5zAvUzb1PXLOzD_g
```

Deciphered this is the contents of the encrypted string. No proof of authority needs to be included in the data - the keys used to encrypt the data proves the authenticity of the cipher.

```
    {
      "id": "cYLsTT1-i",
      "person": {
        "name": "Christian Landgren",
        "pnr": "1212121212"
      },
      "proof": "Anonyn data som verifierar vaccinationen"
    }
```

- Black Keys
The black keys contain the URL and ID to the vaccination proof. This can be used in any phone to verify that the Black Key is still valid and if you have corresponding red key you can also decrypt the encrypted information. 

```
https://vaccineledger.eu/cYLsTT1-i
```

- Public ledger
This is an example of Alice’s public ledger. The ID can be used to find the corresponding block in the ledger.
  

This is and example of the contents of a record in the ledger.

    {
      "id": "cYLsTT1-i",
      "encrypted": {
        "recipients": [
          {
            "encrypted_key": "kSg8EUtsNDBQTqKsQJatyMvoW2kbdPN7HATemWUgV5qEQjIX7vSvkmThnrNEyjF4OpNUBj1Vak-Vo12MEN6HGy-6J_OUYUlD-SSXoeNunSU5B8ssYmk9O1eLec98ZQD4NnGHHV8fqV056hjlFxfYYyJsfOAmNOhR8rDVjfySfv0",
            "header": {
              "enc": "A128CBC-HS256",
              "alg": "RSA-OAEP",
              "kid": "Sweden"
            },
            "protected": [
              "enc",
              "alg",
              "kid"
            ]
          },
          {
            "header": {
              "kid": "Sweden",
              "enc": "A128CBC-HS256",
              "alg": "RSA-OAEP"
            },
            "encrypted_key": "fUFUnLJ_BR9L7K4EDzXfvIjK4hZW65fK7r1Lb2gqsf7ECrlj14BST6AAjK85apX9QX1L--_YE1Uw4qzte_3KrxcVeFgQZUWXFnIAF00V0AKSpy3BaRsXImcNXD7NjjT2gdRLVBtElhffoV3H4gCJBucEDrVwwwlLMyQasOXKoR4",
            "protected": [
              "enc",
              "alg",
              "kid"
            ]
          },
          {
            "header": {
              "kid": "Sweden",
              "enc": "A128CBC-HS256",
              "alg": "RSA-OAEP"
            },
            "encrypted_key": "iGTd6rNSfssnFbayM0NacY_pG3Ix6ok_BN9WPO6vrTRn4YbrvfrvUVlZ_XTNl56znSTTSqgAd8CY0YrKpIxT0pwds4TavP9MgFrapdEU8mlTt1KFTnc6lhuTC6O502FO9EOm0lWhqLBRB4BDKmX7vIno6LheM6JJfA37pvdWUbA",
            "protected": [
              "enc",
              "alg",
              "kid"
            ]
          }
        ],
        "protected": "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiUlNBLU9BRVAiLCJraWQiOiJTd2VkZW4ifQ",
        "iv": "Dt-u7s-9rs9xwx7vCqjO-w",
        "ciphertext": "VxW5xmH_IzmirVpG4aJML3PPYsybSYdulXI7irG163wTwUJQhBuHyw20cfezfwq8Qj8YLtjLwjZlJbadFuAz6ehp3tt4u20pd1MdTVIHa3gYPL-19oPYDOmH5HCMuepDa1J6MfcydDx0EbQY2h5sRP1XUUxWXlaAxxZbijHxwj_SIdlgfrIhnBIK2B01ACEf6a7MCf5zAvUzb1PXLOzD_g",
        "tag": "8pw-kFhbqjtSfWSFsGmLyw"
      },
      "authority": "Sweden",
      "proof": "Anonyn data som verifierar vaccinationen",
      "date": "2021-03-14T13:31:12.450Z",
      "validTo": "2026-03-14T13:31:12.450Z",
      "hash": "7e08d5d0ae3410275d9378d7f8973f12a2b051c1be8ab5dcc31d1b5f97ff2500",
      "prevHash": "4373674dc12990ede72b63ee3a2577d1bad2b5e8bed52589580ad1fe279250b8"
    }
```

## Reference implementation

Download the code and try the mock implementation:

    npm install
    npm start

Read the <a href="index.js">index.js</a> for more understanding on what's going on


## About the authors / contributors
Christian Landgren, CEO Iteam
Adam?, Iteam
Johan Öbrink?, 
