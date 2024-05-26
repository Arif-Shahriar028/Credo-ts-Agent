import { TypedArrayEncoder } from "@aries-framework/core"

export const issuer_credentialDefinitionId = "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/CLAIM_DEF/697659/V1.4"
export const issuer_seed = TypedArrayEncoder.fromString(`12345678912345678912345678912347`)
export const issuer_unqualifiedIndyDid = `LvR6LGmiGzfowBgWtUA5oi` //& returned after registering seed on bcovrin
export const issuer_indyDid = `did:indy:bcovrin:test:${issuer_unqualifiedIndyDid}`

export const issuer_endpoint = 'https://efdc-103-96-36-37.ngrok-free.app'
export const holder_endpoint = 'https://7971-103-96-36-37.ngrok-free.app'
export const verifier_endpoint = 'https://397f-103-96-36-37.ngrok-free.app'

export const genesisUrl = 'http://test.bcovrin.vonx.io/genesis'

export const issued_name = 'Kazi Arif Shahriar'
export const issued_age = '24'