import { logger } from '../../logging'
import { getAllDevices } from './getAll'

let res: Express.Response
let statusSpy: jest.SpyInstance
let jsonSpy: jest.SpyInstance

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
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('getAll', () => {
  it('should set status to 200 and get data with count', async () => {
    const device = {
      connectionStatus: true
    } as any

    const req = {
      query: {
        $count: 1,
        tags: 'tag1,tag2',
        method: 'method',
        $top: 0,
        $skip: 0,
        status: false
      },
      db: {
        devices:
        {
          getByTags: jest.fn().mockReturnValue([device]),
          getCount: jest.fn().mockReturnValue(1)
        }
      }
    }
    await getAllDevices(req, res)
    const tags = req.query.tags.split(',')
    expect(req.db.devices.getByTags).toHaveBeenCalledWith(tags, req.query.method, req.query.$top, req.query.$skip)
    expect(statusSpy).toHaveBeenCalledWith(200)
  })

  it('should set status to 200 and get data as list', async () => {
    const deviceList = []
    const req = {
      query: {
        $count: null,
        tags: null,
        method: 'method',
        $top: 0,
        $skip: 0,
        status: null
      },
      db: {
        devices:
        {
          get: jest.fn().mockReturnValue([])
        }
      }
    }
    await getAllDevices(req, res)
    expect(req.db.devices.get).toHaveBeenCalledWith(req.query.$top, req.query.$skip)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(deviceList)
  })

  it('should set status to 500 if error occurs', async () => {
    const req = {
      query: {
        $count: null,
        tags: null,
        method: 'method',
        $top: 0,
        $skip: 0,
        status: null
      },
      db: {
        devices:
        {
          get: jest.fn().mockImplementation(() => {
            throw new TypeError('fake error')
          })
        }
      }
    }
    const logSpy = jest.spyOn(logger, 'error')
    await getAllDevices(req, res)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(logSpy).toHaveBeenCalled()
  })
})
