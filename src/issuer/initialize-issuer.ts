import { AutoAcceptCredential, AutoAcceptProof, CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent, DidsModule, KeyType, OutOfBandModule, ProofsModule, TypedArrayEncoder, V2CredentialProtocol, V2ProofProtocol } from '@credo-ts/core';
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
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  indyVdr
} from '../../dependencies';

import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
  CheqdDidCreateOptions,
} from '../../dependencies'

import { LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, AnonCredsProofFormatService, LegacyIndyProofFormatService } from '../../dependencies';
import { genesisUrl, issuer_endpoint } from '../../utils/values';
import dotenv from "dotenv";


dotenv.config();


const initializeIssuerAgent = async () => {
  const genesisString = await fetchGenesisString()
  
  const config: InitConfig = {
    label: 'demo-agent-issuer',
    walletConfig: {
      id: 'mainIssuer',
      key: 'demoagentissuer0000000000000000000',
    },
    endpoints: [issuer_endpoint],
    autoUpdateStorageOnStartup: true,
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
        registries : [new IndyVdrAnonCredsRegistry(), new CheqdAnonCredsRegistry()],
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
      cheqd: new CheqdModule(
        new CheqdModuleConfig({
          networks: [
            {
              network: 'testnet',
              cosmosPayerSeed: process.env.COSMOS_PAYER_SEED,
            },
          ],
        })
      ),
      dids: new DidsModule({
        registrars: [new IndyVdrIndyDidRegistrar(), new CheqdDidRegistrar()],
        resolvers: [new IndyVdrIndyDidResolver(), new CheqdDidResolver()],
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
        autoAcceptCredentials: AutoAcceptCredential.Always
      }),

      connections: new ConnectionsModule({ autoAcceptConnections: true }),
      oob: new OutOfBandModule(),
    },
    dependencies: agentDependencies,
  })

  // console.log(agent)

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: 8020 }))

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


export default initializeIssuerAgent;