import { Agent} from '../dependencies';

import setupConnectionListener from '../src/verifier/connection-listener'
import createNewInvitation from '../src/verifier/create-invitation'
import * as readline from 'readline';
import setUpProofListener from '../src/verifier/proof-listener';
import initializeVerifierAgent from '../src/verifier/initialize-verifier';
import requestProof from '../src/verifier/proof-events';


const run = async () => {

  //* Initialize Agent

  console.log('Initializing Verifier agent...')
  const verifierAgent = await initializeVerifierAgent()
  console.log("======================== Verifier Agent =======================")


  //* Creating invitation

  await createInvitation(verifierAgent)
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

const createProofRequest = async(agent: Agent, connectionId: string)=>{
  try{
    const proposeResult = await requestProof(agent, connectionId)
    console.log(proposeResult)
  }catch(error){
    console.log(error)
    await agentOptions(agent, connectionId)
  }

}


const agentOptions = async (agent: Agent, connectionId: string) =>{
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    "\n\n==============>> Select option <<================\n\n"+
    "1. Create New Invitation\n"+
    "2. Proof Request\n\n"+
    "What is your choosen option (number) : \n", 
      async (option: string) => {
        if(option == '1'){
          rl.close();
          await createInvitation(agent) 
        }
        else if(option == '2'){
          rl.close();
          setUpProofListener(agent, async ()=>{
            console.log("proof presentation complete")
            await agentOptions(agent, connectionId)
          })
          await createProofRequest(agent, connectionId);
        }
        // rl.close();
    }
  );
}


export default run

void run()

