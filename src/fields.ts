import configs from './configs.json'

export class Field {
  type: string
  name: string
  title: string
  value: any
  possibleValues: []|null
  required: boolean
  error: string|null
}

export class Section {
  id: number
  title: string
  fields: Field[] = []
}

export const fetchFields = (name: string): Promise<Section[]> => {
  const config = configs[name] ?? { sections: [], fields: [] }

  const sections: Section[] = []

  config.sections.forEach((sectionConfig) => {
    const section = new Section()
    section.id = sectionConfig.id
    section.title = sectionConfig.title
    sections.push(section)
  })
  config.fields.forEach((fieldConfig) => {
    const field = new Field()
    field.type = fieldConfig.type
    field.name = fieldConfig.name
    field.title = fieldConfig.title ?? ''
    field.value = fieldConfig.value ?? null
    field.possibleValues = fieldConfig.possibleValues ?? null
    field.required = fieldConfig.required ?? false
    sections.forEach((section: Section) => {
      if (section.id === fieldConfig.sectionId) {
        section.fields.push(field)
      }
    })
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sections)
    }, 300)
  })
}

export const isSectionsValid = (sections: Section[]): boolean => {
  let isValid: boolean = true
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.required) {
        if (!field.value) {
          isValid = false
          field.error = 'Нужно заполнить'
        } else {
          field.error = null
        }
      }
    })
  })
  return isValid
}

const getExportingValue = (field: Field): any => {
  if (field.value instanceof Date) {
    return field.value.toISOString()
  }
  if (field.value instanceof Object) {
    if (field.value.hasOwnProperty('id')) {
      return { id: field.value.id }
    }
    else if (field.value.hasOwnProperty('value')) {
      return { value: field.value.value }
    }
  }
  return field.value
}

export const getSectionsValues = (sections: Section[]): any => {
  const values = {}
  sections.forEach((section: Section): void => {
    section.fields.forEach((field: Field): void => {
      values[field.name] = getExportingValue(field)
    })
  })
  return values
}
