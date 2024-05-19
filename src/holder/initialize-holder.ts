import { LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, V1ProofProtocol, AnonCredsProofFormatService } from '@aries-framework/anoncreds';
import { DidsModule, CredentialsModule, V2CredentialProtocol, ProofsModule, V2ProofProtocol } from '@aries-framework/core';
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
  AnonCredsRsModule,
  IndyVdrAnonCredsRegistry,
  indyVdr,
  IndyVdrModule,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
} from '../../dependencies';


const initializeHolderAgent = async () => {
  const genesisString = await fetchGenesisString()

  const config: InitConfig = {
    label: 'demo-agent-holder',
    walletConfig: {
      id: 'mainHolder',
      key: 'demoagentholder00000000000000000000',
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
      proofs: new ProofsModule({
        proofProtocols: [
          new V2ProofProtocol({
            proofFormats: [new AnonCredsProofFormatService()],
          }),
        ],
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

export default initializeHolderAgent