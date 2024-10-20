import { AutoAcceptProof, CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent, DidsModule, KeyType, ProofsModule, TypedArrayEncoder, V2CredentialProtocol, V2ProofProtocol } from '../../dependencies';
import {
  AskarModule,
  Agent,
  InitConfig,
  WsOutboundTransport,
  HttpOutboundTransport,
  ConnectionsModule,
  agentDependencies,
  HttpInboundTransport,
  ariesAskar,
  anoncreds,
  AnonCredsModule,
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  indyVdr
} from '../../dependencies';

import { LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, AnonCredsProofFormatService, LegacyIndyProofFormatService } from '../../dependencies';
import { genesisUrl, verifier_endpoint } from '../../utils/values';


const initializeVerifierAgent = async () => {
  const genesisString = await fetchGenesisString()
  
  const config: InitConfig = {
    label: 'demo-agent-verifier',
    walletConfig: {
      id: 'mainVerifier',
      key: 'demoagentverifier0000000000000000000',
    },
    endpoints: [verifier_endpoint],
  }

  // A new instance of an agent is created here
  // Askar can also be replaced by the indy-sdk if required
  const agent = new Agent({
    config,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      anoncreds: new AnonCredsModule({
        // Here we add an Indy VDR registry as an example, any AnonCreds registry
        // can be used
        // registries: [new CheqdAnonCredsRegistry()],
        anoncreds,
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
      proofs: new ProofsModule({
        proofProtocols: [
          new V2ProofProtocol({
            proofFormats: [new AnonCredsProofFormatService(), new LegacyIndyProofFormatService()],
          }),
        ],
        autoAcceptProofs: AutoAcceptProof.ContentApproved
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

  // console.log(agent)

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: 8030 }))

  // Initialize the agent
  await agent.initialize()

  return agent
}

async function fetchGenesisString(): Promise<string> {
  const url = genesisUrl
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


export default initializeVerifierAgent;