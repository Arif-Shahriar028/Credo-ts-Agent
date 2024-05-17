import {Agent} from '../dependencies';

import setupConnectionListener from "../src/holder/connection-listener"
import initializeHolderAgent from '../src/holder/initialize-holder';
import setUpCredentialListener from '../src/holder/credential-listener';
import receiveInvitation from '../src/holder/receive-invitation';

import * as readline from 'readline';


const run = async () => {

  console.log('Initializing Bob agent...')
  const bobAgent = await initializeHolderAgent()

  console.log("======================== Bob Agent =======================")

  //* Take input invitationUrl as a string

  await inputInvitation(bobAgent)
}

const inputInvitation = async (agent: Agent)=>{
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


  rl.question('Please paste the invitation URL: ', async (url: string) => {
    console.log("Setting up connection listener")

    //* Connection Listener
    setupConnectionListener(agent, async (agent: Agent) =>{
      console.log('We now have an active connection with Acme')

      //* Credential Listener
      /**
       * & Inside the callback function
       * & Setup credential listener after connection is established
       */
      setUpCredentialListener(agent, async (agent)=>{
        rl.close()
        await agentOptions(agent)
      })
      rl.close()
      await agentOptions(agent)
    })

    console.log('Accepting the invitation as Bob...');
    await receiveInvitation(agent, url);
    
    rl.close();
  });
}

const agentOptions = async (agent: Agent) =>{
  
  console.log("\n\n==============>> Select option <<================\n")
  console.log("1. Input New Invitation")
  console.log("2. Create Proof Request\n")
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What is your choosen option (number) : ', async (option: string) => {
    if(option == '1'){
      rl.close()
      await inputInvitation(agent)
    }

    else if(option == '2'){
      rl.close();
      console.log("To be implemented")
      await agentOptions(agent)
    }
    // rl.close();
  });
}

export default run

void run()
