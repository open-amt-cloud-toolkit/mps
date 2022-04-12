import { MPSValidationError } from '../../utils/MPSValidationError'
import { updateDevice } from './update'
import { logger } from '../../logging'

let res: Express.Response
let statusSpy: jest.SpyInstance
let jsonSpy: jest.SpyInstance
let endSpy: jest.SpyInstance

beforeEach(() => {
  res = {
    status: () => {
      return res
    },
    json: () => {
      return res
    },
    end: () => {
      return res
    }
  }
  statusSpy = jest.spyOn(res as any, 'status')
  jsonSpy = jest.spyOn(res as any, 'json')
  endSpy = jest.spyOn(res as any, 'end')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('update', () => {
  const guid = '00000000-0000-0000-0000-000000000000'
  const errorSpy = jest.spyOn(logger, 'error')

  it('should set status to 404 if getById gets no result', async () => {
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(null)
        }
      },
      body: {
        guid: guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalledWith(404)
    expect(jsonSpy).toBeCalledWith({ error: 'NOT FOUND', message: `Device ID ${guid} not found` })
    expect(endSpy).toBeCalled()
  })

  it('should set status to 200 if getById gets a result', async () => {
    const device = {} as any

    const req = {
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(device),
          update: () => {}
        }
      },
      body: {
        guid: guid
      }
    }
    const expectedDevice = { ...device, ...req.body }
    const updateSpy = jest.spyOn(req.db.devices, 'update').mockReturnValue(expectedDevice)
    await updateDevice(req as any, res as any)
    expect(updateSpy).toHaveBeenCalled()
    expect(statusSpy).toBeCalledWith(200)
    expect(jsonSpy).toBeCalledWith(expectedDevice)
    expect(endSpy).toBeCalled()
  })

  it('should set status to that of MPSValidationError if it occurs', async () => {
    const errorName = 'FakeMPSError'
    const errorMessage = 'This is a fake error'
    const errorStatus = 555
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new MPSValidationError(errorMessage, errorStatus, errorName)
          })
        }
      },
      body: {
        guid: guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalled()
    expect(jsonSpy).toBeCalledWith({ error: errorName, message: errorMessage })
    expect(endSpy).toBeCalled()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should set status to 500 if error other than MPSValidationError occurs', async () => {
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new TypeError('fake error')
          })
        }
      },
      body: {
        guid: guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalledWith(500)
    expect(endSpy).toBeCalled()
    expect(errorSpy).toHaveBeenCalled()
  })
})
