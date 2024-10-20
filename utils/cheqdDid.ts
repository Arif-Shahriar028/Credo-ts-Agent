export const createCheqdDid = async (agent: any): Promise<string> => {
  try{
    const cheqdDidResult = await agent.dids.create({
      method: 'cheqd',
      secret: {
        verificationMethod: {
          id: 'key-1',
          type: 'Ed25519VerificationKey2020',
        },
      },
      options: {
        network: 'testnet',
        methodSpecificIdAlgo: 'uuid',
      },
    })

    return cheqdDidResult.didState.did;  
  }catch(e){
    console.log(e);
    return ""
  }
}