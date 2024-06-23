import { Agent } from "@aries-framework/core"
import { credentialDefinitionId, issuer_credentialDefinitionId, schemaId, verifier_endpoint } from "../../utils/values"
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import * as QRCode from 'qrcode-terminal';


const requestProof = async(agent: Agent) =>{
    console.log("========= Proposing for proof request ===========")
    // const proofResult = await agent.proofs.requestProof({
    //   connectionId: connectionId,
    //   protocolVersion: 'v2',
    //   name: 'Proof of name and age',
    //   proofFormats: {
    //     anoncreds: {
    //       requested_attributes: {
    //         name: {
    //             name: 'name',
    //         },
    //       },
    //       requested_predicates: {
    //         age: {
    //             name: 'age',
    //             p_type: '>=',
    //             p_value: 18,
    //         },
    //       },
    //       name: 'Proof Request',
    //       version: '1.0',
    //     },
    //   },
    //   comment: 'Request proof comment',
    // })

    const {message, proofRecord} = await agent.proofs.createRequest({
      protocolVersion: 'v2',
      proofFormats: {
        anoncreds: {
          nonce: "1104330525903017641791888",
          name: 'National Id',
          version: '1.0.1',
          requestedAttributes: {
            group1: {
              name: ['name', 'age'],
              restrictions: [
                {
                  // schemaId: schemaId,
                  credentialDefinitionId: credentialDefinitionId
                }
              ]
            },
          }
        }
      }
    })

    console.log('\n', message, '\n')

    const outOfBandRecord = await agent.oob.createInvitation({
      handshake: false,
      messages: [message]
    })

    const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({
      domain: verifier_endpoint
    })

    QRCode.generate(invitationUrl, { small: true }, (qrcode: string) => {
      console.log(qrcode);
    });

    // console.log("Proof result is : ", proofResult)
    return proofRecord
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





