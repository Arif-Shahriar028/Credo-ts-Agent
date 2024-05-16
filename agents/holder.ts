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

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


  rl.question('Please paste the invitation URL: ', async (url: string) => {
    console.log("Setting up connection listener")


    //* Connection Listener
    setupConnectionListener(bobAgent, (agent: Agent) =>{
      console.log('We now have an active connection with Acme')

      //* Credential Listener
      /**
       * & Inside the callback function
       * & Setup credential listener after connection is established
       */
      setUpCredentialListener(agent)
    })

    
    console.log('Accepting the invitation as Bob...');
    await receiveInvitation(bobAgent, url);
    
    // rl.close();
  });

}

export default run

void run()
