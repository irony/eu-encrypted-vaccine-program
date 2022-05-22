Open Egendata
===

## Introduction

Open Egendata is a subset of Egendata protocol but without any infrastructure setup. Egendata was originally developed by Arbetsförmedlingen but was abandoned. This is a try to recreate the most important parts of Egendata and make them freely available to everyone to use without restrictions.

## Basic usage

This is the basic usage of the lib. Add recipients and let them read your data.

    const egendata = require('egendata')

    const bob = egendata.createActor('Bob')
    const alice = egendata.createActor('Alice')
    const charlie = egendata.createActor('Charlie')

    const package = bob.create({some: 'secure data'})
    bob.addReader(package, alice.key)
    alice.read(package) // {some: 'secure data'}

    charlie.read(package) // throws 'no key found' error

## Practical usage

To use this protocol you will need to provide keys for your users. This is done with:

  1. A key handling app called Egendata
  2. This app reads your sites public key through your https://domain.com/.well_known/jwks
  3. 


## LICENSE

GNU GENERAL PUBLIC LICENSE