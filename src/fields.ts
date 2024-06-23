import configs from './configs.json'

export type Field = {
  type: string
  name: string
  title: string
  value: any
  possibleValues?: []|null
  required: boolean
  error: string|null
}

export type Section = {
  id: number
  title: string
  fields: Field[]
}

export const fetchFields = (name: string): Promise<Section[]> => {
  const config = configs[name] ?? { sections: [], fields: [] }

  const sections: Section[] = []

  config.sections.forEach((sectionConfig) => {
    const section: Section = {
      id: sectionConfig.id,
      title: sectionConfig.title,
      fields: [],
    }
    sections.push(section)
  })
  config.fields.forEach((fieldConfig) => {
    const field: Field = {
      type: fieldConfig.type,
      name: fieldConfig.name,
      title: fieldConfig.title,
      value: fieldConfig.value ?? null,
      required: fieldConfig.required ?? false,
      error: null,
    }
    if (fieldConfig.hasOwnProperty('possibleValues')) {
      field.possibleValues = fieldConfig.possibleValues
    }
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
  sections.forEach((section: Section) => {
    section.fields.forEach((field: Field) => {
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
