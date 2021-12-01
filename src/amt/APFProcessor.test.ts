import APFProcessor from './APFProcessor'

describe('APF Processor ', () => {
  it('should convert a byte to guid', async () => {
    const result = APFProcessor.guidToStr('44454C4C4B0010428033B6C04F504633')
    expect(result).toBe('4C4C4544-004B-4210-8033-B6C04F504633')
  })
})
