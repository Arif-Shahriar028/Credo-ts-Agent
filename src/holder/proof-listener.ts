import { Agent, ProofEventTypes, ProofState, ProofStateChangedEvent } from "@aries-framework/core";

const setUpProofListener = (agent: Agent, cb: (...args: any) => void) =>{
  agent.events.on<ProofStateChangedEvent>(ProofEventTypes.ProofStateChanged, async ({ payload }) => {

    console.log(">>>>>  " + payload.proofRecord.state)
    
    // if(payload.proofRecord.state === ProofState.RequestReceived){
    //   await agent.proofs.requestProof({
    //     connectionId: connectionId,
    //     protocolVersion: 'v2',
    //     proofFormats: {
    //       anoncreds: {
    //         attributes: [{ name: 'age', value: 'value' }],
    //       },
    //     },
    //   })
    // }
    // else if(payload.proofRecord.state === ProofState.Done){
    //   console.log("Proof accepted")
    // }
  })
}

export default setUpProofListener