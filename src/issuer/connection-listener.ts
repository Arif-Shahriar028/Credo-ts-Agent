import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
  OutOfBandRecord,
} from '../../dependencies';


const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {

  const eventHandler = ({ payload }: ConnectionStateChangedEvent) => {
    console.log("=======================================");
    console.log("payload.connectionRecord.state : " + payload.connectionRecord.state);

    if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
    if (payload.connectionRecord.state === DidExchangeState.Completed) {

      console.log("================= Checking outOfBandId ======================");
      console.log("payload.connectionRecord.outOfBandId : " + payload.connectionRecord.role);
      console.log("outOfBandRecord.id : " + outOfBandRecord.id);

      console.log("=================== Connection Successful ====================");
      console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`);

      // Custom business logic can be included here
      console.log("Connection established with holder");
      console.log("connection id: " + payload.connectionRecord.did);

      cb(agent, payload.connectionRecord.id);

      // Remove the event listener
      agent.events.off(ConnectionEventTypes.ConnectionStateChanged, eventHandler);
    }
  };

  agent.events.on(ConnectionEventTypes.ConnectionStateChanged, eventHandler);
};


export default setupConnectionListener;