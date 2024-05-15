import { KeyType, TypedArrayEncoder} from '@aries-framework/core';


import initializeIssuerAgent from '../src/issuer/initialize-issuer'
import setupConnectionListener from '../src/issuer/connection-listener'
import createNewInvitation from '../src/issuer/create-invitation'
import setUpCredentialListener from '../src/issuer/credential-listener'
import publishSchema from '../src/issuer/schema-definition';
import publishCredentialDefinition from '../src/issuer/credential-definition';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';


const seed = TypedArrayEncoder.fromString(`12345678912345678912345678912347`)
const unqualifiedIndyDid = `LvR6LGmiGzfowBgWtUA5oi` //& returned after registering seed on bcovrin
const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`



const run = async () => {
  console.log('Initializing Issuer agent...')
  const issuerAgent = await initializeIssuerAgent()

  console.log("======================== Issuer Agent =======================")

  console.log("========= Importing DIDs into wallet ===========")

  await issuerAgent.dids.import({
    did: indyDid,
    overwrite: true,
    privateKeys: [
      {
        privateKey: seed,
        keyType: KeyType.Ed25519,
      },
    ],
  })


  //* Publishing Schema definition to ledger
  /**
   * ! This functionality is comment out, as schema is already published into the ledger
   */
  // console.log("=========== schema definition ============")

  // const schemaResult = await publishSchema(issuerAgent, indyDid);

  // if (schemaResult.schemaState.state === 'failed') {
  //   throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
  // }else{
  //   console.log("=============== Schema structure ==============")
  //   console.log(schemaResult)
  // }

  //* Publishing credential definition on top of scema definition to ledger
  /**
   * ! This functionality is comment out, as credential definition is already published into the ledger
   */
  // const credentialDefinitionResult = await publishCredentialDefinition(issuerAgent, indyDid, schemaResult)
  
  // if (credentialDefinitionResult.credentialDefinitionState.state === 'failed') {
  //   throw new Error(
  //     `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
  //   )
  // }else{
  //   console.log("=============== Credential definition ===============")
  //   console.log(credentialDefinitionResult)
  // }
  
 

  
  //* Creating invitation

  console.log('Creating the invitation')
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(issuerAgent)

  console.log("============== Invitation URL ==============")
  console.log(invitationUrl)
  console.log("=============================================")
  console.log('Listening for connection changes...')


  //* Credential listener

  setUpCredentialListener(issuerAgent, ()=>{
    console.log("credential issuence done")
  })


  //* Connection Listener

  setupConnectionListener(issuerAgent, outOfBandRecord, async(agent, connectionId) => {
    console.log('We now have an active connection with Bob, connection Id :' + connectionId)


    
    //* Credential Offer to holder 
    /**
     * & Credential will be offered after connection established.
     * & Thats why this functionality is implemented in the callback function.
     */
    console.log("Issuing credential to the holder")
    const offerCred = await agent.credentials.offerCredential({
      protocolVersion: 'v2',
      connectionId: connectionId,
      credentialFormats: {
        anoncreds: {
          // credentialDefinitionId: credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId!,
          credentialDefinitionId : "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/CLAIM_DEF/697659/V1.4", //! This id is already existed in the sovrin ledger
          attributes: [
            { name: 'name', value: 'kazi Arif Shahriar' },
            { name: 'age', value: '24' },
          ],
        },
      },
    })
    console.log("offerCred object:")
    console.log( offerCred)
  } 
  )
}


export default run

void run()

