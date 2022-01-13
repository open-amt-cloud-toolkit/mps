import index from './index'

describe('Check index from health', () => {
  let indexSpy: jest.SpyInstance
  beforeEach(() => {
    indexSpy = jest.spyOn(index, 'get')
  })
  it('should pass', async () => {
    expect(indexSpy).toBeDefined()
  })
})
