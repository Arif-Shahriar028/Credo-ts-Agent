import { Agent } from '../dependencies';
import { createInterface } from 'readline';
import initializeHolderAgent from '../src/holder/initialize-holder';
import setupConnectionListener from '../src/holder/connection-listener';
import setUpCredentialListener from '../src/holder/credential-listener';
import receiveInvitation from '../src/holder/receive-invitation';
import setUpProofListener from '../src/holder/proof-listener';
import proposeProof from '../src/holder/proof-events';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptUser = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const showOptions = async (agent: Agent, connectionId: string): Promise<void> => {
  console.log("\n==============>> Select option <<================");
  console.log("1. Input New Invitation");
  console.log("2. Create Proof Request");
  
  const option = await promptUser('What is your chosen option (number): ');
  
  if (option === '1') {
    await inputInvitation(agent);
  } else if (option === '2') {
    await handleProofRequest(agent, connectionId);
  } else {
    console.log("Invalid option. Please try again.");
    await showOptions(agent, connectionId);
  }
};

const handleProofRequest = async (agent: Agent, connectionId: string): Promise<void> => {
  console.log("Connection id is: ", connectionId);
  
  setUpProofListener(agent, connectionId, () => {
    console.log("Proof presentation complete");
  });
  
  try {
    const proposeResult = await proposeProof(agent, connectionId);
    console.log(proposeResult);
  } catch (error) {
    console.error("Error proposing proof:", error);
  }
  
  await showOptions(agent, connectionId);
};

const inputInvitation = async (agent: Agent): Promise<void> => {
  const url = await promptUser('Please paste the invitation URL: ');
  console.log("Setting up connection listener");
  
  // setupConnectionListener(agent, async (agent: Agent, connectionId: string) => {
  //   console.log('We now have an active connection with Acme');
    
  //   setUpCredentialListener(agent, async (agent: Agent) => {
  //     console.log('Credential received successfully');
  //     await showOptions(agent, connectionId);
  //   });
    
  //   await showOptions(agent, connectionId);
  // });
  
  console.log('Accepting the invitation as Bob...');
  await receiveInvitation(agent, url);
};

const run = async (): Promise<void> => {
  console.log('Initializing Bob agent...');
  const bobAgent = await initializeHolderAgent();
  console.log("======================== Bob Agent =======================");
  

  setupConnectionListener(bobAgent, async (agent: Agent, connectionId: string) => {
    console.log('We now have an active connection with Acme');
  });

  setUpCredentialListener(bobAgent, async (agent: Agent) => {
    console.log('Credential received successfully');
  });

  await inputInvitation(bobAgent);
};

export default run;

void run();