import {
  Agent,
} from '../../dependencies';


const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  // console.log(outOfBandRecord.outOfBandInvitation)

  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:3003' }),
    outOfBandRecord,
  }
}

export default createNewInvitation;