// dependencies.ts

import { AskarModule } from '@credo-ts/askar';
import {
  Agent,
  InitConfig,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  WsOutboundTransport,
  HttpOutboundTransport,
  DidExchangeState,
  OutOfBandRecord,
  ConnectionsModule,
} from '@credo-ts/core';
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { AnonCredsModule, AnonCredsApi } from '@credo-ts/anoncreds';

import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from '@credo-ts/indy-vdr'

import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
  CheqdDidCreateOptions,
} from '@credo-ts/cheqd'

import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, AnonCredsProofFormatService, LegacyIndyProofFormatService } from '@credo-ts/anoncreds';
import { AutoAcceptProof, CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent, DidsModule, KeyType, ProofsModule, TypedArrayEncoder, V2CredentialProtocol, V2ProofProtocol } from '@credo-ts/core';

import { ProofEventTypes, ProofState, ProofStateChangedEvent } from '@credo-ts/core'

export {
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
  AnonCredsApi,
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  indyVdr,
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
  CheqdDidCreateOptions,
  LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, AnonCredsProofFormatService, LegacyIndyProofFormatService,
  AutoAcceptProof, CredentialEventTypes, CredentialsModule, CredentialState, CredentialStateChangedEvent, DidsModule, KeyType, ProofsModule, TypedArrayEncoder, V2CredentialProtocol, V2ProofProtocol,
  ProofEventTypes, ProofState, ProofStateChangedEvent
};
