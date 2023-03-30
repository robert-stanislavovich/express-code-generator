const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const models = require('./models-setup');

function generateTemplateVariables(setup) {
  const {
    modelUpperCamel,
    modelLowerCamel,
    modelUpperUnderscore,
    modelLowerUnderscore,
  } = setup;

  return {
    modelUpperCamel,
    modelLowerCamel,
    modelUpperUnderscore,
    modelLowerUnderscore,
    fieldsSetup: setup.fields,
    _filename_: setup.filename,
  };
}

function renderTemplate(template, vars) {
  return ejs.render(template, vars);
}

const templateNames = ['routes/MODEL', 'services/MODEL', 'docs'];

async function main() {
  const templates = {};

  templateNames.forEach((tmplName) => {
    const tmplPath = `src/templates/${tmplName}.ejs`;
    templates[tmplName] = fs.readFileSync(tmplPath).toString();
  });

  for (const modelSetup of models) {
    const {
      modelUpperCamel,
      modelLowerCamel,
      modelUpperUnderscore,
      modelLowerUnderscore,
      filename
    } = modelSetup;

    const vars = generateTemplateVariables(modelSetup);

    for (const tmplName of templateNames) {
      
        const resultFilename = `gen/${tmplName}.ts`
          .replace(/MODEL/g, filename)
          .replace(/docs.ts/g, 'docs.yaml')

        const rendered = await renderTemplate(templates[tmplName], vars);

        const dirname = path.dirname(resultFilename);

        fs.mkdirSync(path.join(dirname), { recursive: true });

        fs.writeFileSync(resultFilename, rendered);
     
    }
  }

  console.log('all done');
}

main();
