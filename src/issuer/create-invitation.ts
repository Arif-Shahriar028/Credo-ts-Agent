import {
  Agent,
} from '../../dependencies';

import * as QRCode from 'qrcode-terminal';
import { issuer_endpoint } from '../../utils/values';

// import qrcode from 'qrcode-terminal'

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({ domain: issuer_endpoint })

  QRCode.generate(invitationUrl, { small: true }, (qrcode: string) => {
    console.log(qrcode);
});


  return {
    invitationUrl,  
    outOfBandRecord,
  }
}

export default createNewInvitation;