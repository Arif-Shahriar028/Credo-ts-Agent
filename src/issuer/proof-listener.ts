// proof listener - issuer

import { ProofEventTypes, ProofState, ProofStateChangedEvent } from '@aries-framework/core';
import {
  Agent,
} from '../../dependencies';


const setUpProofListener = (agent: Agent, cb: (...args: any) => void) =>{
  console.log("Setting up proof listener\n")

  const eventHandler = async ({payload}: ProofStateChangedEvent) =>{
    console.log("\n>>>>>  " + payload.proofRecord.state)
    
    if(payload.proofRecord.state === ProofState.ProposalReceived){
      await agent.proofs.acceptProposal({proofRecordId: payload.proofRecord.id})
    }
    else if(payload.proofRecord.state === ProofState.RequestReceived){
      await agent.proofs.acceptPresentation({proofRecordId: payload.proofRecord.id})
    }
    else if(payload.proofRecord.state === ProofState.Done){
      console.log("Proof accepted")
    }
  }

  agent.events.off(ProofEventTypes.ProofStateChanged, eventHandler)
  agent.events.on(ProofEventTypes.ProofStateChanged, eventHandler)
}

export default setUpProofListener