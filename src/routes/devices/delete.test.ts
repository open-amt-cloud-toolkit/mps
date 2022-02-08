import { logger } from '../../logging'
import { deleteDevice } from './delete'

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
  endSpy = jest.spyOn(res as any, 'end')
  jsonSpy = jest.spyOn(res as any, 'json')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

const req = {
  params: {
    guid: '00000000-0000-0000-0000-000000000000'
  },
  db: {
    devices: {
      delete: () => {},
      getByName: () => {}
    }
  }
} as any

describe('delete', () => {
  it('should set status to 404 and not delete device if it does not exist in db', async () => {
    req.db.devices.getByName = jest.fn().mockReturnValue(null)
    await deleteDevice(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(404)
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'NOT FOUND', message: `Device ID ${req.params.guid} not found` })
    expect(endSpy).toHaveBeenCalled()
  })

  it('should set status to 204 and delete device if it exists in db', async () => {
    req.db.devices.getByName = jest.fn().mockReturnValue({})
    req.db.devices.delete = jest.fn().mockReturnValue({})
    await deleteDevice(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(204)
    expect(jsonSpy).not.toHaveBeenCalled()
    expect(endSpy).toHaveBeenCalled()
  })

  it('should set status to 500 and not delete device if error occurs', async () => {
    req.db.devices.getByName = jest.fn().mockImplementation(() => {
      throw new TypeError('fake error')
    })
    req.db.devices.delete = jest.fn().mockReturnValue({})
    const errorSpy = jest.spyOn(logger, 'error')
    await deleteDevice(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(jsonSpy).not.toHaveBeenCalled()
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
  })
})
