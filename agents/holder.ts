import {Agent} from '../dependencies';

import setupConnectionListener from "../src/holder/connection-listener"
import initializeHolderAgent from '../src/holder/initialize-holder';
import setUpCredentialListener from '../src/holder/credential-listener';
import receiveInvitation from '../src/holder/receive-invitation';
import setUpProofListener from '../src/holder/proof-listener';

import * as readline from 'readline';


const run = async () => {

  console.log('Initializing Bob agent...')
  const bobAgent = await initializeHolderAgent()

  console.log("======================== Bob Agent =======================")

  //* Take input invitationUrl as a string

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await inputInvitation(bobAgent, rl)
}

const inputInvitation = async (agent: Agent, rl: any)=>{

  rl.question('Please paste the invitation URL: ', async (url: string) => {
    console.log("Setting up connection listener")

    //* Connection Listener
    setupConnectionListener(agent, async (agent: Agent, connectionId) =>{
      console.log('We now have an active connection with Acme')

      //* Credential Listener
      /**
       * & Inside the callback function
       * & Setup credential listener after connection is established
       */
      setUpCredentialListener(agent, async (agent)=>{
        await agentOptions(agent, connectionId, rl)
      })
      await agentOptions(agent, connectionId, rl)
    })

    console.log('Accepting the invitation as Bob...');
    await receiveInvitation(agent, url);
    
  });
}

const agentOptions = async (agent: Agent, connectionId: string, rl: any) =>{
  
  console.log("\n\n==============>> Select option <<================\n")
  console.log("1. Input New Invitation")
  console.log("2. Create Proof Request\n")

  rl.question('What is your choosen option (number) : ', async (option: string) => {
    if(option == '1'){
      await inputInvitation(agent, rl)
    }

    else if(option == '2'){
      // console.log("To be implemented")
      // const connectionId = await agent.connections.
      console.log("Connection id is: ", connectionId)

      setUpProofListener(agent, ()=>{
        console.log("Proof presention complete")
      })

      await agentOptions(agent, connectionId, rl)
    }
  });
}


export default run

void run()


