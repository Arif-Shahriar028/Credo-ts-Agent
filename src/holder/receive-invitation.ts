import { Agent } from "../../dependencies"

const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord, connectionRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl)

  return outOfBandRecord
}

export default receiveInvitation