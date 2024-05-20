
import {CredentialStateChangedEvent, CredentialEventTypes, CredentialState } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';

const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) => {
  console.log("============= Setting up credential listener =============");

  const eventHandler = async ({ payload }: CredentialStateChangedEvent) => {
    console.log(">>>>  " + payload.credentialRecord.state);

    if (payload.credentialRecord.state === CredentialState.OfferReceived) {
      await agent.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id });
    } 
    if (payload.credentialRecord.state === CredentialState.CredentialReceived) {
      await agent.credentials.acceptCredential({ credentialRecordId: payload.credentialRecord.id });
    } 
    else if (payload.credentialRecord.state === CredentialState.Done) {
      console.log("Full Credential record");
      console.log(payload.credentialRecord);

      console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`);

      cb(agent);

      // Remove the event listener
      agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);
    }
  };

  agent.events.on(CredentialEventTypes.CredentialStateChanged, eventHandler);
}


export default setUpCredentialListener

