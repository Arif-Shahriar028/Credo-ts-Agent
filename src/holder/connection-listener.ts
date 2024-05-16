
import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
} from '../../dependencies';

const setupConnectionListener = (agent: Agent, cb: (...args: any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {

    console.log("================== Connection Record state =====================")
	  console.log("payload.connectionRecord.state : "+payload.connectionRecord.state)

    // if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      
      console.log("Connection established with issuer")
      console.log("This did: "+payload.connectionRecord.did+" , Thread id"+payload.connectionRecord.threadId)
      console.log("Their did: "+payload.connectionRecord.theirDid + ", Their label: "+ payload.connectionRecord.theirLabel)
      console.log("connection id: "+payload.connectionRecord.id)
      cb(agent)
      // We exit the flow
      // process.exit(0)
    }
  })
}

export default setupConnectionListener