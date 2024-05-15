import { LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService } from '@aries-framework/anoncreds';
import { DidsModule, CredentialsModule, V2CredentialProtocol, CredentialStateChangedEvent, CredentialEventTypes, CredentialState } from '@aries-framework/core';
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
  indyVdr,
  IndyVdrModule,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
} from '../dependencies';

import * as readline from 'readline';


const initializeBobAgent = async () => {
  const genesisString = await fetchGenesisString()
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label. It also sets the mediator invitation url,
  // because this is most likely required in a mobile environment.
  const config: InitConfig = {
    label: 'demo-agent-bob',
    walletConfig: {
      id: 'mainBob',
      key: 'demoagentbob00000000000000000000',
    },
    endpoints: ['http://localhost:3002'],
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
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: 'bcovrin:test',
            genesisTransactions: genesisString,
            connectOnStartup: true,
          },
        ],
      }),
      dids: new DidsModule({
        registrars: [new IndyVdrIndyDidRegistrar()],
        resolvers: [new IndyVdrIndyDidResolver()],
      }),
      credentials: new CredentialsModule({
        credentialProtocols: [
          new V2CredentialProtocol({
            credentialFormats: [new LegacyIndyCredentialFormatService(), new AnonCredsCredentialFormatService()],
          }),
        ],
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
  agent.registerInboundTransport(new HttpInboundTransport({ port: 3002 }))



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


const setUpCredentialListener = (holder: Agent)=>{
  console.log("============= Setting up credential listener =============")
  holder.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {
    console.log("Credential state: " + payload.credentialRecord.state)
    switch (payload.credentialRecord.state) {
      case CredentialState.OfferReceived:
        console.log('received a credential, credential id: '+ payload.credentialRecord.id)
        // custom logic here
        await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })
      case CredentialState.Done:
        console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
        // For demo purposes we exit the program here.
        // process.exit(0)
    }
  })
}

//* Fetching genesis transaction
async function fetchGenesisString(): Promise<string> {
  const url = 'http://test.bcovrin.vonx.io/genesis';

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const genesisString = await response.text();
      return genesisString;
  } catch (error) {
      console.error('Error fetching genesis string:', error);
      throw error;
  }
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
    setUpCredentialListener(bobAgent)
    setupConnectionListener(bobAgent, (agent: Agent) =>{
      console.log('We now have an active connection with Acme')
    }
  )
    console.log('Accepting the invitation as Bob...');
    await receiveInvitation(bobAgent, url);
    
    // rl.close();
  });

}

export default run

void run()
