import { Metadata } from "@aries-framework/core/build/storage/Metadata"
import { Agent } from "../../dependencies"

const issueCredential = async (agent: any, connectionId: string, credentialDefinitionId: string) =>{
  console.log("Issuing credential to the holder")
  await agent.credentials.offerCredential({
    protocolVersion: 'v2',
    connectionId: connectionId,
    credentialFormats: {
      anoncreds: {
        // credentialDefinitionId: credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId!,
        // credentialDefinitionId : "did:indy:bcovrin:test:LvR6LGmiGzfowBgWtUA5oi/anoncreds/v0/CLAIM_DEF/726812/V1.4", //! This id is already existed in the sovrin ledger
        // credentialDefinitionId: "LvR6LGmiGzfowBgWtUA5oi:3:CL:730547:National Id",
        credentialDefinitionId: credentialDefinitionId,
        attributes: [
          { name: 'name', value: 'Arif Shahriar' },
          { name: 'age', value: '24' },
        ],
      },
    },
  })
}

export default issueCredential