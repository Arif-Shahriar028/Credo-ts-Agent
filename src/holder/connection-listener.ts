
import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
} from '../../dependencies';

const setupConnectionListener = (agent: Agent, cb: (...args: any) => void) => {
  const eventHandler = ({payload}: ConnectionStateChangedEvent) =>{
    console.log("================== Connection Record state =====================")
	  console.log("payload.connectionRecord.state : "+payload.connectionRecord.state)

    // if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      
      console.log("Connection established with issuer")
      console.log("This did: "+payload.connectionRecord.did+" , Thread id"+payload.connectionRecord.threadId)
      console.log("Their did: "+payload.connectionRecord.theirDid + ", Their label: "+ payload.connectionRecord.theirLabel)
      console.log("connection id: "+payload.connectionRecord.id)
      
      cb(agent, payload.connectionRecord.id)

      agent.events.off(ConnectionEventTypes.ConnectionStateChanged, eventHandler)
      // We exit the flow
      // process.exit(0)
    }
  }

  agent.events.on(ConnectionEventTypes.ConnectionStateChanged, eventHandler)
}

export default setupConnectionListener