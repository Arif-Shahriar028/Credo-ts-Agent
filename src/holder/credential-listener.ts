
import {CredentialStateChangedEvent, CredentialEventTypes, CredentialState } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (holder: Agent)=>{
  console.log("============= Setting up credential listener =============")

  holder.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {

    //^ console log credential state everytime when event emits
    console.log("Credential state: " + payload.credentialRecord.state)

    switch (payload.credentialRecord.state) {

      case CredentialState.OfferReceived:
        console.log('received a credential, credential id: '+ payload.credentialRecord.id)
        await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })

      case CredentialState.Done:
        console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
        // For demo purposes we exit the program here.
        // process.exit(0)
    }
  })
}


export default setUpCredentialListener