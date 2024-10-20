import { Agent, KeyType, TypedArrayEncoder} from '@credo-ts/core';

import initializeIssuerAgent from '../src/issuer/initialize-issuer'
import setupConnectionListener from '../src/issuer/connection-listener'
import createNewInvitation from '../src/issuer/create-invitation'
import setUpCredentialListener from '../src/issuer/credential-listener'
import registerSchema from '../src/issuer/register-schema';
import registerCredentialDefinition from '../src/issuer/register-credential-def';
import { anoncreds } from '../dependencies';
import * as readline from 'readline';
import { issueCredential, issueCredentialWithoutConn } from '../src/issuer/issue-credential';


import { issuer_seed } from "../utils/values"
import { issuer_indyDid } from "../utils/values"
import { createCheqdDid } from '../utils/cheqdDid';
import dotenv from "dotenv";


dotenv.config();

let schemaId = ''
let credentialDefinitionId = ''

const run = async () => {

  //* Initialize Agent

  console.log('Initializing Issuer agent...')
  const issuerAgent = await initializeIssuerAgent()
  console.log("======================== Issuer Agent =======================")

  // const secretIds = await (issuerAgent as any).modules.anoncreds.getLinkSecretIds()

  // console.log(`Secret id: ${secretIds}`)
  // TODO: create cheqd did and import it to the agent
  const cheqdDid = await createCheqdDid(issuerAgent);
  // const cheqdDid = 'did:cheqd:testnet:94d3cb09-09ba-42a8-bf4f-6c1ef2205ee6';
  console.log("cheqdDID: ",cheqdDid)
  // console.log(process.env.COSMOS_PAYER_SEED)

  //* Importing public did from ledger to agent wallet

  console.log("========= Importing DIDs into wallet ===========")
  await issuerAgent.dids.import({
    did: cheqdDid,
    overwrite: true,
    privateKeys: [
      {
        privateKey: issuer_seed,
        keyType: KeyType.Ed25519,
      },
    ],
  })


  //* Publishing Schema definition to ledger
  /**
   * ! This functionality is comment out, as schema is already published into the ledger
   */
  schemaId = await registerSchema(issuerAgent, cheqdDid)
  


  //* Publishing credential definition on top of scema definition to ledger
  /**
   * ! This functionality is comment out, as credential definition is already published into the ledger
   */
  credentialDefinitionId = await registerCredentialDefinition(issuerAgent, cheqdDid, schemaId)
  
 
  
  //* Creating invitation

  await createInvitation(issuerAgent)

  //* offer credential without connection
  // await issueCredentialWithoutConn(issuerAgent, credentialDefinitionId);
}


const createInvitation = async(agent: Agent)=>{
  
  console.log('Creating the invitation')
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(agent)

  console.log("============== Invitation URL ==============")
  console.log(invitationUrl)
  console.log("=============================================")
  console.log('Listening for connection changes...')

  //* Connection Listener

  setupConnectionListener(agent, outOfBandRecord, async(agent, connectionId) => {
      console.log('We now have an active connection with Bob, connection Id :' + connectionId)

      //* Agent options
      await agentOptions(agent, connectionId)
    } 
  )
}


const agentOptions = async (agent: Agent, connectionId: string) =>{
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    "\n\n==============>> Select option <<================\n\n"+
    "1. Issue Credential\n"+
    "2. Create New Invitation\n\n"+
    "What is your choosen option (number) : \n", 
      async (option: string) => {
        if(option == '1'){
          console.log("===========>>> Setting up credential listener <<<===========\n")
          
          //* Credential listener
          setUpCredentialListener(agent, async (agent: Agent)=>{
            rl.close();
            await agentOptions(agent, connectionId)
          })

          await issueCredential(agent, connectionId, credentialDefinitionId)
        }

        else if(option == '2'){
          rl.close();
          await createInvitation(agent)
        }
        // rl.close();
    }
  );
}


export default run

void run()

