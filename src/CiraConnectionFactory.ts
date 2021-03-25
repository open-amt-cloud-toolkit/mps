
export class CiraConnectionFactory {
  factoryFn: (guid: any) => any
  constructor (factoryFn: (guid: any) => any) {
    this.factoryFn = factoryFn
  }

  getConnection (uuid): any {
    return this.factoryFn(uuid)
  }
}
