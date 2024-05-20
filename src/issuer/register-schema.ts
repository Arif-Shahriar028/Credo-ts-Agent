import { Agent } from "@aries-framework/core"

const registerSchema = async(agent: Agent, indyDid: string)=>{

  console.log("=========== schema definition ============")

  const schemaResult = await agent.modules.anoncreds.registerSchema({
    schema: {
      attrNames: ['name', 'age'],
      issuerId: indyDid,
      name: 'Certificate schema',
      version: '1.0.3',
    },
    options: {},
  })
  if (schemaResult.schemaState.state === 'failed') {
    throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
  }else{
    console.log("=============== Schema structure ==============")
    console.log(schemaResult)
  }
  return schemaResult
}

export default registerSchema;