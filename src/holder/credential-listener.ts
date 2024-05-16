
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
      await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })
    } 
    if(payload.credentialRecord.state === CredentialState.CredentialReceived){
      await holder.credentials.acceptCredential({ credentialRecordId: payload.credentialRecord.id })
    }
    else if(payload.credentialRecord.state === CredentialState.Done){
      console.log("Full Credential record")
      console.log(payload.credentialRecord)
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
    }
  })
}


export default setUpCredentialListener

