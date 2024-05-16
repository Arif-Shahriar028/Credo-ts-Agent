import { CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) =>{
  agent.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {

    console.log("Credential state: " + payload.credentialRecord.state)
    
    if(payload.credentialRecord.state === CredentialState.ProposalReceived){
      console.log("Accepting proposal")
      await agent.credentials.acceptProposal({credentialRecordId: payload.credentialRecord.id})
    }
    else if(payload.credentialRecord.state === CredentialState.RequestReceived){
      console.log("Accepting request")
      await agent.credentials.acceptRequest({credentialRecordId: payload.credentialRecord.id})
    }
    else if(payload.credentialRecord.state === CredentialState.CredentialIssued){
      console.log('Credential issued')
    }
    else if(payload.credentialRecord.state === CredentialState.Done){
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
    }
  })
}

export default setUpCredentialListener



// ProposalSent = "proposal-sent",
// ProposalReceived = "proposal-received",
// OfferSent = "offer-sent",
// OfferReceived = "offer-received",
// Declined = "declined",
// RequestSent = "request-sent",
// RequestReceived = "request-received",
// CredentialIssued = "credential-issued",
// CredentialReceived = "credential-received",
// Done = "done",
// Abandoned = "abandoned"