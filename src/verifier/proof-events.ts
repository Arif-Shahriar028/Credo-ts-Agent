import { Agent } from "@credo-ts/core"
import { issuer_credentialDefinitionId } from "../../utils/values"
import { fetchCredentialDefinition } from "@credo-ts/anoncreds"

const requestProof = async(agent: any, connectionId: string) =>{
    console.log("========= Proposing for proof request ===========")
    const proofResult = await agent.proofs.requestProof({
      connectionId: connectionId,
      protocolVersion: 'v2',
      name: 'Proof of name and age',
      proofFormats: {
        anoncreds: {
          requested_attributes: requestedAttributes,
          // requested_predicates: {
          //   "predicate1_referent": {
          //       name: 'age',
          //       p_type: '>=',
          //       p_value: 18,
          //       // restrictions: [{ cred_def_id: issuer_credentialDefinitionId }]
          //   },
          // },
          name: 'Proof Request',
          version: '1.0',
        },
      },
      comment: 'Request proof comment',
    })
    // console.log("Proof result is : ", proofResult)
    return proofResult
}

const requestedAttributes = 
{
  attr1: { 
    name: 'name',
    // restrictions: [{
    //   cred_def_id: issuer_credentialDefinitionId ,
    // }]
  } 
}

// const newProofAttribute = async (agent: any, cred_def_id: string) => {
//   // Fetch the credential definition from a ledger or local store
//   const credDef = await fetchCredentialDefinition(cred_def_id);

//   // Extract the attributes from the credential definition
//   const attributes = credDef.getAttributes();

//   // Create a proof attribute structure
//   const proofAttribute = {};
//   for (const attr of attributes) {
//     proofAttribute[attr] = {
//       name: attr,
//       restrictions: [{ cred_def_id: cred_def_id }]
//     };
//   }

//   return proofAttribute; 
// }

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





