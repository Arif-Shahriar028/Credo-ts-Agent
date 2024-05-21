import { Agent, KeyType, TypedArrayEncoder} from '@aries-framework/core';

import initializeIssuerAgent from '../src/issuer/initialize-issuer'
import setupConnectionListener from '../src/issuer/connection-listener'
import createNewInvitation from '../src/issuer/create-invitation'
import setUpCredentialListener from '../src/issuer/credential-listener'
import registerSchema from '../src/issuer/register-schema';
import registerCredentialDefinition from '../src/issuer/register-credential-def';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import * as readline from 'readline';
import issueCredential from '../src/issuer/issue-credential';


import { issuer_seed } from "../utils/values"
import { issuer_indyDid } from "../utils/values"



const run = async () => {

  //* Initialize Agent

  console.log('Initializing Issuer agent...')
  const issuerAgent = await initializeIssuerAgent()
  console.log("======================== Issuer Agent =======================")


  //* Importing public did from ledger to agent wallet

  console.log("========= Importing DIDs into wallet ===========")
  await issuerAgent.dids.import({
    did: issuer_indyDid,
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
  // const schemaResult = await registerSchema(issuerAgent, indyDid)
  


  //* Publishing credential definition on top of scema definition to ledger
  /**
   * ! This functionality is comment out, as credential definition is already published into the ledger
   */
  // const credentialDefinitionResult = await registerCredentialDefinition(issuerAgent, indyDid, schemaResult)
  
 
  
  //* Creating invitation

  await createInvitation(issuerAgent)
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
            console.log("credential issuence done")
            rl.close();
            await agentOptions(agent, connectionId)
          })

          await issueCredential(agent, connectionId)
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

