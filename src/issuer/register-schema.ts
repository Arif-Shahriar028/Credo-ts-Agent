import { AnonCredsApi } from "@aries-framework/anoncreds"
import { Agent } from "@aries-framework/core"

const registerSchema = async(agent: Agent, indyDid: string)=>{

  console.log("=========== Registering Schema definition ============")

  //* Configuring anoncreds for ledger query
  const anonCreds = (agent.modules as any).anoncreds as AnonCredsApi

  const schemaTemplate = {
    attrNames: ['name', 'age'],
    issuerId: indyDid,
    name: 'Certificate schema',
    version: '1.0.4',
  }

  //* Fetching already existed schema in the ledger

  const schemaResult = await anonCreds.getCreatedSchemas({
    schemaName: schemaTemplate.name,
    schemaVersion: schemaTemplate.version,
    issuerId: schemaTemplate.issuerId,
  })

  //* SchemaResult is returned as a array 
  if(schemaResult.length >0){
    console.log("Schema already exists")
    console.log(`Schema : \n`, schemaResult)
    return schemaResult[0].schemaId
  } 
  
  //* If no schema registered withing this schema name and version
  else{
    const schemaResult = await agent.modules.anoncreds.registerSchema({
      schema: schemaTemplate,
      options: {},
    })
    if (schemaResult.schemaState.state === 'failed') {
      throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
    }else{
      console.log("=============== Schema structure ==============")
      console.log(schemaResult)
    }
    return schemaResult.schemaState.schemaId
  }

}

export default registerSchema;