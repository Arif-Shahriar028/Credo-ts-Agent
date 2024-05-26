import { CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) => {
  // Define the event handler function
  const eventHandler = async ({ payload }: CredentialStateChangedEvent) => {
    console.log(">>>>>  " + payload.credentialRecord.state);
    
    if (payload.credentialRecord.state === CredentialState.ProposalReceived) {
      await agent.credentials.acceptProposal({ credentialRecordId: payload.credentialRecord.id });
    } 
    else if (payload.credentialRecord.state === CredentialState.RequestReceived) {
      await agent.credentials.acceptRequest({ credentialRecordId: payload.credentialRecord.id });
    } 
    else if (payload.credentialRecord.state === CredentialState.CredentialIssued) {
      console.log("Credential Issued");
    } 
    else if (payload.credentialRecord.state === CredentialState.Done) {
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`);
      
      // Execute the callback function
      cb(agent);
      
      // Remove the event listener
      agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);
    }
    else if(payload.credentialRecord.state === CredentialState.Abandoned){
      console.log("Credential rejected by the holder, NOT ACCEPTED!")

      // Execute the callback function
      cb(agent);
      
      // Remove the event listener
      agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);
    }
  };

  // Attach the event handler to the event
  agent.events.on(CredentialEventTypes.CredentialStateChanged, eventHandler);
};


export default setUpCredentialListener
