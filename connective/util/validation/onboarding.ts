import {ValidationResponse} from "../../types/types"

export function business(name: string, size: string, industry: string, occupation: string, description: string, status: string): ValidationResponse {
  let res = new ValidationResponse()

  res.fields = [
    {name: "name", success: true},
    {name: "size", success: true},
    {name: "industry", success: true},
    {name: "occupation", success: true},
    {name: "description", success: true},
    {name: "status", success: true}
  ]

  if (name == "") {
    res.invalidateField("name", "You must enter a name.")
  }
  if (size == "") {
    res.invalidateField("size", "You must select your company size.")
  }
  if (industry == "") {
    res.invalidateField("industry", "You must select an industry.")
  }
  if(occupation == "") {
    res.invalidateField("occupation", "You must select an occupation.")
  }
  if (description.length > 500) {
    res.invalidateField("description", "Description must be less than 500 characters.")
  }
  if (description == "") {
    res.invalidateField("description", "You must enter a description.")
  }
  if (status == "") {
    res.invalidateField("status", "You must select a status.")
  }

  return res
}

export function individual(name: string, description: string, industry: string, occupation: string, status: string): ValidationResponse {
  let res = new ValidationResponse()

  res.fields = [
    {name: "name", success: true},
    {name: "description", success: true},
    {name: "industry", success: true},
    {name: "occupation", success: true},
    {name: "status", success: true}
  ]

  if (name == "") {
    res.invalidateField("name", "You must enter a name.")
  }
  if (industry == "") {
    res.invalidateField("industry", "You must select an industry.")
  }
  if (occupation == "") {
    res.invalidateField("occupation", "You must select an occupation.")
  }
  if (description.length > 500) {
    res.invalidateField("description", "Bio must be less than 500 characters.")
  }
  if (description == "") {
    res.invalidateField("description", "You must enter a bio.")
  }
  if (status == "") {
    res.invalidateField("status", "You must select a status.")
  }

  return res
}