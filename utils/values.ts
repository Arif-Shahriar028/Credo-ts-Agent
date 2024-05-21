import { TypedArrayEncoder } from "@aries-framework/core"

export const issuer_credentialDefinitionId = "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/CLAIM_DEF/697659/V1.4"
export const issuer_seed = TypedArrayEncoder.fromString(`12345678912345678912345678912347`)
export const issuer_unqualifiedIndyDid = `LvR6LGmiGzfowBgWtUA5oi` //& returned after registering seed on bcovrin
export const issuer_indyDid = `did:indy:bcovrin:test:${issuer_unqualifiedIndyDid}`