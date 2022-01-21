import * as authValidator from './authValidator'

describe('Check authValidator from auth', () => {
  let authSpy: jest.SpyInstance
  beforeEach(() => {
    authSpy = jest.spyOn(authValidator, 'authValidator')
  })
  it('should pass if defined', async () => {
    expect(authSpy).toBeDefined()
  })
})
