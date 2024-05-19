import { Agent } from "@aries-framework/core"
import { credentialDefinitionId } from "../../utils/values"

const proposeProof = async(agent: Agent, connectionId: string) =>{
    console.log("========= Proposing for proof request ===========")
    const proofResult = await agent.proofs.proposeProof({
      connectionId: connectionId,
      protocolVersion: 'v2',
      proofFormats: {
        anoncreds: {
          attributes: [{ name: 'key', value: 'value', "cred_def_id": credentialDefinitionId }],
          predicates: []
        },
      },
      comment: 'Propose proof comment',
    })
    // console.log("Proof result is : ", proofResult)
    return proofResult
}

export default proposeProof