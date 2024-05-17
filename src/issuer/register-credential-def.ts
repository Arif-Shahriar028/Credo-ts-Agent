import { Agent } from "@aries-framework/core"

const registerCredentialDefinition = async(agent: Agent, indyDid: string, schemaResult?: any) =>{
  const credentialDefinitionResult = await agent.modules.anoncreds.registerCredentialDefinition({
    credentialDefinition: {
      tag: 'V1.4',
      issuerId: indyDid,
      schemaId: schemaResult.schemaState.schemaId!, // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
      // schemaId : "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/SCHEMA/Certificate schema/1.0.0", //! using a existing schemaId in the ledger
    },
    options: {},
  })

  if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
    throw new Error(
      `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
    )
  }else{
    console.log("=============== Credential definition ===============")
    console.log(credentialDefinitionResult)
  }
  
  return credentialDefinitionResult
}

export default registerCredentialDefinition