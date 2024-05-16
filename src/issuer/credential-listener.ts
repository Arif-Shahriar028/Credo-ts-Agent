import { CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) =>{
  agent.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {

    console.log(">>>>>  " + payload.credentialRecord.state)
    
    if(payload.credentialRecord.state === CredentialState.ProposalReceived){
      await agent.credentials.acceptProposal({credentialRecordId: payload.credentialRecord.id})
    }
    else if(payload.credentialRecord.state === CredentialState.RequestReceived){
      await agent.credentials.acceptRequest({credentialRecordId: payload.credentialRecord.id})
    }
    else if(payload.credentialRecord.state === CredentialState.CredentialIssued){
    }
    else if(payload.credentialRecord.state === CredentialState.Done){
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
    }
  })
}

export default setUpCredentialListener
