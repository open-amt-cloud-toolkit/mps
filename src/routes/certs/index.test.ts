import { mpsrootcert } from './index'
import { createSpyObj } from '../../test/helper/jest'
import { ErrorResponse } from '../../utils/amtHelper'

describe('Check index', () => {
  let resSpy
  let req

  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
  })
  it('should fail if cert not provided', async () => {
    req = {}
    await mpsrootcert(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith(ErrorResponse(500, 'MPS root certificate does not exists.'))
  })
  it('should pass if cert provided', async () => {
    req = {
      certs: {
        web_tls_config: {
          ca: 'fake'
        }
      }
    }
    await mpsrootcert(req, resSpy)
    expect(resSpy.send).toHaveBeenCalled()
  })
  it('should handle exception', async () => {
    await mpsrootcert(null, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith(ErrorResponse(500, 'Request failed while downloading MPS root certificate.'))
  })
})
