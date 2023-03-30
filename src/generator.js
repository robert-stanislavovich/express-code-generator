const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const models = require('./models-setup');


function renderTemplate(template, templateVariables) {
  return ejs.render(template, templateVariables);
}

const templateNames = ['routes/MODEL', 'services/MODEL', 'docs/docs'];

async function main() {
  const templates = {};

  templateNames.forEach((tmplName) => {
    const tmplPath = `src/templates/${tmplName}.ejs`;
    templates[tmplName] = fs.readFileSync(tmplPath).toString();
  });

  for (const modelSetup of models) {
    const {      
      filename
    } = modelSetup;

    const templateVariables = modelSetup;

    for (const tmplName of templateNames) {
      
        const resultFilename = `gen/${tmplName}.ts`
          .replace(/MODEL/g, filename)
          .replace(/docs.ts/g, `${filename}.yaml`)

        const rendered = await renderTemplate(templates[tmplName], templateVariables);

        const dirname = path.dirname(resultFilename);

        fs.mkdirSync(path.join(dirname), { recursive: true });

        fs.writeFileSync(resultFilename, rendered);
     
    }
  }

  console.log('CODE GENERATED');
}

main();
