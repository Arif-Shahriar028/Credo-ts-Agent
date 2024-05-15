import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
  OutOfBandRecord,
} from '../../dependencies';


const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {

    console.log("=======================================")
	  console.log("payload.connectionRecord.state : "+payload.connectionRecord.state)

    if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      // the connection is now ready for usage in other protocols!
      console.log("================= Checking outOfBandId ======================")
      console.log("payload.connectionRecord.outOfBandId : "+payload.connectionRecord.role)
      console.log("outOfBandRecord.id : " + outOfBandRecord.id)

      console.log("=================== Connection Successful ====================")
      console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)

      // Custom business logic can be included here
      // In this example we can send a basic message to the connection, but
      // anything is possible
      // cb()
      console.log("Connection established with holder")
      console.log("connection id: "+payload.connectionRecord.did)

      cb(agent, payload.connectionRecord.id)

      // We exit the flow
      // process.exit(0)
    }
  })
}

export default setupConnectionListener;