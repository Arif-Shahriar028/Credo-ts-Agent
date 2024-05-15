import { CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) =>{
  agent.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {

    console.log("Credential state: " + payload.credentialRecord.state)
    
    switch (payload.credentialRecord.state) {
      case CredentialState.ProposalReceived:
        console.log("Accepting proposal")
        await agent.credentials.acceptProposal({credentialRecordId: payload.credentialRecord.id})
      case CredentialState.CredentialIssued:
        console.log('Credential issued')

      case CredentialState.Done:
        console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
        // For demo purposes we exit the program here.
        // process.exit(0)
    }
  })
}

export default setUpCredentialListener