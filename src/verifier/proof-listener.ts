// proof listener - issuer

import { ProofEventTypes, ProofState, ProofStateChangedEvent } from '@credo-ts/core';
import {
  Agent,
} from '../../dependencies';


const setUpProofListener = (agent: Agent, cb: (...args: any) => void) =>{
  console.log(">>>>> Setting up proof listener\n")

  const eventHandler = async ({payload}: ProofStateChangedEvent) =>{
    console.log("\n>>>>>  " + payload.proofRecord.state)
    // if(payload.proofRecord.state === ProofState.ProposalReceived){
    //   await agent.proofs.acceptProposal({proofRecordId: payload.proofRecord.id})
    // }
     if(payload.proofRecord.state === ProofState.RequestReceived){
      await agent.proofs.acceptPresentation({proofRecordId: payload.proofRecord.id})
    }
    else if(payload.proofRecord.state === ProofState.Done || payload.proofRecord.state === ProofState.Abandoned){
      console.log("------>>>>> Payload: ", payload.proofRecord)
      
      await agent.events.off(ProofEventTypes.ProofStateChanged, eventHandler)
      await cb();
    }
  }

  agent.events.on(ProofEventTypes.ProofStateChanged, eventHandler)
}

export default setUpProofListener