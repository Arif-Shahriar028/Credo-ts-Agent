import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { AnonCredsApi } from "@aries-framework/anoncreds"
import { Agent } from "@aries-framework/core"

const registerCredentialDefinition = async(agent: Agent, issuerId: string, schemaId?: any) =>{

  console.log("=============== Credential definition ===============")

  //* Configuring anoncreds for ledger query

  const anonCreds = (agent.modules as any).anoncreds as AnonCredsApi

  const credentialDefTemplate = {
    schemaId : schemaId,
    issuerId: issuerId,
    tag: 'National Id'
  }

  const credentialDefinitionResult = await agent.modules.anoncreds.getCreatedCredentialDefinitions(credentialDefTemplate)

  if(credentialDefinitionResult.length > 0){
    console.log("Credential definition already existed")
    console.log("Credential definition id: ", credentialDefinitionResult[0]._tags.unqualifiedCredentialDefinitionId)
    return credentialDefinitionResult[0]._tags.unqualifiedCredentialDefinitionId
  }

  else{
    const credentialDefinitionResult = await agent.modules.anoncreds.registerCredentialDefinition({
      credentialDefinition: credentialDefTemplate,
      options: {},
    })
  
    if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      )
    }else{
      console.log("Credential definition registered")
      console.log("Credential definition id: ", credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId) 
    }
    return credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId
  }
}

export default registerCredentialDefinition