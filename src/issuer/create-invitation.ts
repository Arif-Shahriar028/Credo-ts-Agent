import {
  Agent,
} from '../../dependencies';
// import qr from 'qrcode'

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  // const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:3001' })


  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:3001' }),
    outOfBandRecord,
  }
}

export default createNewInvitation;