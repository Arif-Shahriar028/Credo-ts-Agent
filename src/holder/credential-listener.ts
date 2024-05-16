
import {CredentialStateChangedEvent, CredentialEventTypes, CredentialState } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (holder: Agent)=>{
  console.log("============= Setting up credential listener =============")

  holder.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {

    //^ console log credential state everytime when event emits
    console.log(">>>>  " + payload.credentialRecord.state)

    if(payload.credentialRecord.state === CredentialState.OfferReceived){
      console.log('received a credential, credential id: '+ payload.credentialRecord.id)
      await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })
    } 
    if(payload.credentialRecord.state === CredentialState.CredentialReceived){
      console.log('Credential received')
      await holder.credentials.acceptCredential({ credentialRecordId: payload.credentialRecord.id })
    }
    else if(payload.credentialRecord.state === CredentialState.Done){
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
      console.log('credential state : ', payload.credentialRecord.state)
      console.log('Comparing parameter', CredentialState.Done)
      console.log(payload.credentialRecord)
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