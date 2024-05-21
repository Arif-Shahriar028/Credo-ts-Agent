import { Agent } from "@aries-framework/core"
import { issuer_credentialDefinitionId } from "../../utils/values"

const proposeProof = async(agent: Agent, connectionId: string) =>{
    console.log("========= Proposing for proof request ===========")
    const proofResult = await agent.proofs.proposeProof({
      connectionId: connectionId,
      protocolVersion: 'v2',
      proofFormats: {
        anoncreds: {
          attributes: [
            { 
              name: 'name',
              restrictions: [{
                cred_def_id: issuer_credentialDefinitionId ,
              }]
            }, 
            {
              name: 'age',
              restrictions: [{
                cred_def_id: issuer_credentialDefinitionId ,
              }]
            }
          ],
          predicates: []
        },
      },
      comment: 'Propose proof comment',
    })
    // console.log("Proof result is : ", proofResult)
    return proofResult
}

export default proposeProof

// {name: 'age', p_type: '>=', p_value: '18'}
