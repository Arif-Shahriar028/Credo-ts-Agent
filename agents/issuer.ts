import { DidsModule, KeyType, TypedArrayEncoder } from '@aries-framework/core';
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
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  indyVdr
} from '../dependencies';
import { stringify } from 'querystring';
import { METHODS } from 'http';


const seed = TypedArrayEncoder.fromString(`12345678912345678912345678912347`) // What you input on bcovrin. Should be kept secure in production!
const unqualifiedIndyDid = `LvR6LGmiGzfowBgWtUA5oi` // will be returned after registering seed on bcovrin
const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`

const initializeAcmeAgent = async () => {
  const genesisString = await fetchGenesisString()
  
  const config: InitConfig = {
    label: 'demo-agent-acme',
    walletConfig: {
      id: 'mainAcme',
      key: 'demoagentacme0000000000000000000',
    },
    endpoints: ['http://localhost:3001'],
  }

  // A new instance of an agent is created here
  // Askar can also be replaced by the indy-sdk if required
  const agent = new Agent({
    config,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      anoncreds: new AnonCredsModule({
        // Here we add an Indy VDR registry as an example, any AnonCreds registry
        // can be used
        // registries: [new CheqdAnonCredsRegistry()],
        registries : [new IndyVdrAnonCredsRegistry()],
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

      connections: new ConnectionsModule({ autoAcceptConnections: true }),
    },
    dependencies: agentDependencies,
  })

  // console.log(agent)

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }))

  // Initialize the agent
  await agent.initialize()

  return agent
}


const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  // console.log(outOfBandRecord.outOfBandInvitation)

  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:3001' }),
    outOfBandRecord,
  }
}


const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {

    console.log("=======================================")
	  console.log("payload.connectionRecord.state : "+payload.connectionRecord.state)

    if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      // the connection is now ready for usage in other protocols!
      console.log("================= Checking outOfBandId ======================")
      console.log("payload.connectionRecord.outOfBandId : "+payload.connectionRecord.outOfBandId)
      console.log("outOfBandRecord.id : " + outOfBandRecord.id)

      console.log("=================== Connection Successful ====================")
      console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)

      // Custom business logic can be included here
      // In this example we can send a basic message to the connection, but
      // anything is possible
      cb()

      // We exit the flow
      process.exit(0)
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
  console.log('Initializing Acme agent...')
  const acmeAgent = await initializeAcmeAgent()

  console.log("======================== Acme Agent =======================")

  console.log("========= Importing DIDs into wallet ===========")

  await acmeAgent.dids.import({
    did: indyDid,
    overwrite: true,
    privateKeys: [
      {
        privateKey: seed,
        keyType: KeyType.Ed25519,
      },
    ],
  })


  //* Publishing Schema definition to ledger
  // console.log("=========== schema definition ============")

  // const schemaResult = await acmeAgent.modules.anoncreds.registerSchema({
  //   schema: {
  //     attrNames: ['name'],
  //     issuerId: indyDid,
  //     name: 'Certificate schema',
  //     version: '1.0.1',
  //   },
  //   options: {},
  // })

  // if (schemaResult.schemaState.state === 'failed') {
  //   throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
  // }else{
  //   console.log("=============== Schema structure ==============")
  //   console.log(schemaResult)
  // }


  //* Publishing credential definition on top of scema definition to ledger
  // const credentialDefinitionResult = await acmeAgent.modules.anoncreds.registerCredentialDefinition({
  //   credentialDefinition: {
  //     tag: 'default',
  //     issuerId: indyDid,
  //     // schemaId: schemaResult.schemaState.schemaId!, // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
  //     schemaId : "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/SCHEMA/Certificate schema/1.0.0",
  //   },
  //   options: {},
  // })
  
  // if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
  //   throw new Error(
  //     `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
  //   )
  // }else{
  //   console.log("=============== Credential definition ===============")
  //   console.log(credentialDefinitionResult)
  // }
  
 
  //* Creating invitation 
  console.log('Creating the invitation')
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(acmeAgent)

  console.log("============== Invitation URL ==============")
  console.log(invitationUrl)
  console.log("=============================================")

  console.log('Listening for connection changes...')
  setupConnectionListener(acmeAgent, outOfBandRecord, () =>
    console.log('We now have an active connection with Bob')
  )
}


export default run

void run()

