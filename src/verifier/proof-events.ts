import { Agent } from "@aries-framework/core"
import { issuer_credentialDefinitionId } from "../../utils/values"

const requestProof = async(agent: any, connectionId: string) =>{
    console.log("========= Proposing for proof request ===========")
    const proofResult = await agent.proofs.requestProof({
      connectionId: connectionId,
      protocolVersion: 'v2',
      name: 'Proof of name and age',
      proofFormats: {
        anoncreds: {
          requested_attributes: {
            name: {
                name: 'name',
            },
          },
          requested_predicates: {
            age: {
                name: 'age',
                p_type: '>=',
                p_value: 18,
            },
          },
          name: 'Proof Request',
          version: '1.0',
        },
      },
      comment: 'Request proof comment',
    })
    // console.log("Proof result is : ", proofResult)
    return proofResult
}

export default requestProof


// predicates
// {name: 'age', p_type: '>=', p_value: '18'}

// connectionId: connectionId,
//       protocolVersion: 'v2',
//       proofFormats: {
//         anoncreds: {
//           attributes: [
//             { 
//               name: 'name',
//               restrictions: [{
//                 cred_def_id: issuer_credentialDefinitionId ,
//               }]
//             }, 
//             {
//               name: 'age',
//               restrictions: [{
//                 cred_def_id: issuer_credentialDefinitionId ,
//               }]
//             }
//           ],
//           predicates: []
//         },
//       },
//       comment: 'Propose proof comment',





