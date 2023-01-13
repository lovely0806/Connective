export type Occupation = {
    id: number,
    name: string
}

export type Industry = {
    id: number,
    name: string,
    occupations: Occupation[]
}

export interface IValidationItem {
    name: string,
    success: boolean,
    error?: string
}
  
export class ValidationResponse {
    success: boolean
    fields: IValidationItem[]
  
    constructor() {
      this.success = true
      this.fields = []
    }
  
    getFieldByName(name: string) {
      return this.fields.filter(field => field.name === name)[0]
    }
  
    invalidateField(name: string, error: string) {
      let field = this.getFieldByName(name)
      field.success = false
      field.error = error
      this.success = false
    }
}