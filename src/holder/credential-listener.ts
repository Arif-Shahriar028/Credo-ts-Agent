
import {CredentialStateChangedEvent, CredentialEventTypes, CredentialState } from '../../dependencies';
import {
  Agent,
} from '../../dependencies';

const setUpCredentialListener = (agent: Agent, cb: (...args: any) => void) => {
  console.log("============= Setting up credential listener =============");

  // const eventHandler = async ({ payload }: CredentialStateChangedEvent) => {
  //   console.log(">>>>  " + payload.credentialRecord.state);

  //   if (payload.credentialRecord.state === CredentialState.OfferReceived) {
  //     console.log(payload.credentialRecord);
  //     await agent.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id });
  //   } 
  //   if (payload.credentialRecord.state === CredentialState.RequestReceived) {
  //     // await agent.credentials.acceptRequest({ credentialRecordId: payload.credentialRecord.id });
  //   } 
  //   if (payload.credentialRecord.state === CredentialState.CredentialReceived) {
  //     // await agent.credentials.acceptCredential({ credentialRecordId: payload.credentialRecord.id });
  //   } 
  //   else if (payload.credentialRecord.state === CredentialState.Done) {
  //     console.log("Full Credential record");
  //     console.log(payload.credentialRecord);

  //     console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`);

  //     // Remove the event listener
  //     // await agent.events.off(CredentialEventTypes.CredentialStateChanged, eventHandler);

  //     // cb(agent);
  //   }
  // };

  // agent.events.on(CredentialEventTypes.CredentialStateChanged, eventHandler);

  agent.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {
    console.log("----->>> ", payload.credentialRecord.state)
    switch (payload.credentialRecord.state) {
      case CredentialState.OfferReceived:
        console.log('received a credential')
        // custom logic here
        await agent.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })
        break
      case CredentialState.RequestSent:
        console.log('Credential request sent. Waiting for response...');
        // Implement a timeout check here
        setTimeout(async () => {
          const updatedRecord = await agent.credentials.getById(payload.credentialRecord.id);
          if (updatedRecord.state === CredentialState.RequestSent) {
            console.log('Credential request timed out. Consider retrying or checking issuer status.');
            // Implement retry logic or error handling here
          }
        }, 30000); // 30 seconds timeout, adjust as needed
        break;
      case CredentialState.Done:
        console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
        // For demo purposes we exit the program here.
        process.exit(0)
      case CredentialState.Abandoned:
        console.log('Credential exchange abandoned');
        console.log('Credential Record:', JSON.stringify(payload.credentialRecord, null, 2));
        // Implement recovery or retry logic here
        break;
    }
  })
}


export default setUpCredentialListener

