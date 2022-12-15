import path from 'path'

// const fs = require('fs');

export function getTemplateImagePath(template: number): string | undefined {
  const templateImagePath = path.resolve('./data/template', `img/${template}.png`)
  // if (fs.existsSync(templateImagePath)) {
  return templateImagePath
  // }
}
