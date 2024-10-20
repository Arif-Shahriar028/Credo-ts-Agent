import { AutoAcceptCredential } from "@credo-ts/core"
import { Agent } from "../../dependencies"
import * as QRCode from 'qrcode-terminal';
import { issuer_endpoint } from "../../utils/values";

export const issueCredential = async (agent: any, connectionId: string, credentialDefinitionId: string) =>{
  console.log("Issuing credential to the holder")
  const credentialOfferRecord = await agent.credentials.offerCredential({
    protocolVersion: 'v2',
    connectionId: connectionId,
    credentialFormats: {
      anoncreds: {
        // credentialDefinitionId: credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId!,
        // credentialDefinitionId : "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/CLAIM_DEF/726812/V1.4", //! This id is already existed in the sovrin ledger
        // credentialDefinitionId: "LvR6LGmiGzfowBgWtUA5oi:3:CL:730547:National Id",
        credentialDefinitionId: credentialDefinitionId,
        attributes: [
          { name: 'name', value: 'Arif Shahriar' },
          { name: 'age', value: '24' },
        ],
      },
    },
  })
}


export const issueCredentialWithoutConn = async (agent: any, credentialDefinitionId: string) =>{
  console.log("Issuing credential to the holder without connection")
  
  const { message } = await agent.credentials.createOffer({
    protocolVersion: 'v2',
    autoAcceptCredential: AutoAcceptCredential.Always,
    credentialFormats: {
      anoncreds: {
        credentialDefinitionId: credentialDefinitionId,
        attributes: [
          { name: 'name', value: 'Arif Shahriar' },
          { name: 'age', value: '24' },
        ],
      },
    },
  });
  
  // Create an out-of-band invitation with the credential offer
  console.log(message)
  console.log("Create an out-of-band invitation with the credential offer")
  const outOfBandRecord = await agent.oob.createInvitation({ // Empty array for connectionless
    messages: [message],
  });
  
  
  // Generate the invitation URL
  console.log("Generate the invitation URL")

  const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({
    domain: issuer_endpoint,
  });

  // QRCode.generate(invitationUrl, { small: true }, (qrcode: string) => {
  //   console.log(qrcode);
  // });
  
  console.log('Credential Offer URL:', invitationUrl);
}
