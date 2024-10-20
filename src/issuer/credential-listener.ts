import { CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent } from '../../dependencies';
import {
  Agent,
} from '../../dependencies';


const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) => {
  // Define the event handler function
  const eventHandler = async ({ payload }: CredentialStateChangedEvent) => {
    console.log(">>>>>  " + payload.credentialRecord.state);
    
    if (payload.credentialRecord.state === CredentialState.ProposalReceived) {
      console.log(payload.credentialRecord.credentials);
      await agent.credentials.acceptProposal({ credentialRecordId: payload.credentialRecord.id });
    } 
    else if (payload.credentialRecord.state === CredentialState.RequestReceived) {
      // await agent.credentials.acceptRequest({ credentialRecordId: payload.credentialRecord.id });
    } 
    else if (payload.credentialRecord.state === CredentialState.CredentialIssued) {
      console.log("Credential Issued");
      await agent.credentials.sendProblemReport({ credentialRecordId: payload.credentialRecord.id, description: "problem" })
    } 
    else if (payload.credentialRecord.state === CredentialState.Done) {
      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`);
      
      // Execute the callback function
      
      // Remove the event listener
      await agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);

      cb(agent);
    }
    else if(payload.credentialRecord.state === CredentialState.Abandoned){
      console.log("Credential rejected by the holder, NOT ACCEPTED!")

      // Execute the callback function
      
      // Remove the event listener
      await agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);

      cb(agent);
    }
  };

  // Attach the event handler to the event
  agent.events.on(CredentialEventTypes.CredentialStateChanged, eventHandler);
};


export default setUpCredentialListener
