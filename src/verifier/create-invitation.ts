import {
  Agent,
} from '../../dependencies';
import * as QRCode from 'qrcode-terminal';
import { verifier_endpoint } from '../../utils/values';

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({ domain: verifier_endpoint })

  QRCode.generate(invitationUrl, { small: true }, (qrcode: string) => {
    console.log(qrcode);
  });


  return {
    invitationUrl,
    outOfBandRecord,
  }
}

export default createNewInvitation;