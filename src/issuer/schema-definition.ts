import { Agent } from "@aries-framework/core"

const publishSchema = async(agent: Agent, indyDid: string)=>{
  const result = await agent.modules.anoncreds.registerSchema({
    schema: {
      attrNames: ['name', 'age'],
      issuerId: indyDid,
      name: 'Certificate schema',
      version: '1.0.3',
    },
    options: {},
  })
  return result
}

export default publishSchema;