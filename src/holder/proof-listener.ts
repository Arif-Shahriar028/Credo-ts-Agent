import { Agent, ProofEventTypes, ProofState, ProofStateChangedEvent } from "@aries-framework/core";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { credentialDefinitionId } from "../../utils/values";

const setUpProofListener = (holder: any, connectionId: string, cb: (...args: any) => void) =>{


  const eventHandler = async ({payload}: ProofStateChangedEvent) =>{
    console.log("\n>>>>>  " + payload.proofRecord.state)
    
    if(payload.proofRecord.state === ProofState.RequestReceived){

      const requestedCredentials = await holder.proofs.selectCredentialsForRequest({proofRecordId: payload.proofRecord.id,});
      
      await holder.proofs.acceptRequest({
        proofRecordId: payload.proofRecord.id,
        proofFormats: requestedCredentials.proofFormats, 
      });

      // const credentialsForRequest = await holder.proofs.getCredentialsForRequest({
      //   proofRecordId: payload.proofRecord.id
      // });
  
      // console.log("Credentials for request:", credentialsForRequest.proofFormats.anoncreds.attributes);

    }
    else if(payload.proofRecord.state === ProofState.Done){
      console.log("Proof accepted")
    }
  }

  holder.events.off(ProofEventTypes.ProofStateChanged, eventHandler)
  holder.events.on(ProofEventTypes.ProofStateChanged, eventHandler)
}

export default setUpProofListener