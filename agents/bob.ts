import {
  AskarModule,
  Agent,
  InitConfig,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  WsOutboundTransport,
  HttpOutboundTransport,
  DidExchangeState,
  OutOfBandRecord,
  ConnectionsModule,
  agentDependencies,
  HttpInboundTransport,
  ariesAskar,
  anoncreds,
  AnonCredsModule,
  AnonCredsRsModule,
  IndyVdrAnonCredsRegistry,
} from '../dependencies';

import * as readline from 'readline';


const initializeBobAgent = async () => {
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label. It also sets the mediator invitation url,
  // because this is most likely required in a mobile environment.
  const config: InitConfig = {
    label: 'demo-agent-bob',
    walletConfig: {
      id: 'mainBob',
      key: 'demoagentbob00000000000000000000',
    },
  }

  // A new instance of an agent is created here
  // Askar can also be replaced by the indy-sdk if required
  const agent = new Agent({
    config,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      //* newly added
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      anoncreds: new AnonCredsModule({
        // Here we add an Indy VDR registry as an example, any AnonCreds registry
        // can be used
        registries: [new IndyVdrAnonCredsRegistry()],
      }),
      connections: new ConnectionsModule({ autoAcceptConnections: true }),
    },
    dependencies: agentDependencies,
  })

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Register a simple `Http` inbound transport
  // agent.registerInboundTransport(new HttpInboundTransport({ port: 3002 }))



  // Initialize the agent
  await agent.initialize()

  return agent
}


const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord, connectionRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl)

  // console.log("Receiving invitation and outOfBandRecord is:")
  // console.log(outOfBandRecord)

  // console.log("================= OutOfBandRecord ========================")
  // console.log(outOfBandRecord.outOfBandInvitation);

  // console.log("==================== Connection record =====================")
  // console.log(connectionRecord)

  return outOfBandRecord
}


const setupConnectionListener = (agent: Agent, cb: (...args: any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {

    console.log("================== Connection Record state =====================")
	  console.log("payload.connectionRecord.state : "+payload.connectionRecord.state)

    // if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      // the connection is now ready for usage in other protocols!
      // console.log("=======================================")
      // console.log("payload.connectionRecord.outOfBandId : "+payload.connectionRecord.outOfBandId)
      // console.log("outOfBandRecord.id : " + outOfBandRecord.id)

      // console.log("=======================================")
      // console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)

      // Custom business logic can be included here
      // In this example we can send a basic message to the connection, but
      // anything is possible
      cb()

      // We exit the flow
      // process.exit(0)
    }
  })
}



const run = async () => {
  console.log('Initializing Bob agent...')
  const bobAgent = await initializeBobAgent()

  console.log("======================== Bob Agent =======================")

  // take input invitationUrl as a string
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Please paste the invitation URL: ', async (url: string) => {
    console.log("Setting up connection listener")
    setupConnectionListener(bobAgent, () =>
      console.log('We now have an active connection with Acme')
    )
    console.log('Accepting the invitation as Bob...');
    await receiveInvitation(bobAgent, url);
    rl.close();
  });

  // console.log('Accepting the invitation as Bob...')
  // await receiveInvitation(bobAgent, invitationUrl)

}

export default run

void run()
