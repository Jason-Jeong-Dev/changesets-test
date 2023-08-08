const fs = require('fs');

const tokens = require("../src/tokens.json");
const { separateTokens } = require("./seperate-tokens.cjs");


const { typographyTokenKeys, hadaTokens, shoplTokens, fontWeightTokens, borderRadiusTokens, spacingTokens } = separateTokens(tokens);

console.log(hadaTokens)
console.log(shoplTokens)


function toTypeScript(obj, tokens) {
  let result = `export const ${tokens} = {\n`;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      result += `${key}: ${JSON.stringify(value, null, 2).replace(/"/g, '')} = ${JSON.stringify(value, null, 2).replace(/"/g, '')};\n`;
    } else {
      result += `  ${key}: '${value}',\n`;
    }
  }
  result += '};\n';
  return result;
}
function typoMapping(obj) {
  console.log(JSON.stringify(obj, null, 2))
  let result = '';
  result += 'import { css } from \'@emotion/react\';\n\n' +
    'import { fontWeights as fontWeight } from \'./fontWeights\'; \n\n'
  result += obj;
  result += `export const typographies = {\n`;
  typographyTokenKeys.forEach(key => {
    result += `  ${key},\n`;
  });
  result += '};\n';

  return result;
}





fs.writeFileSync('src/shopl-typographies.ts', typoMapping(shoplTokens.typographyTokens, shoplTokens));
fs.writeFileSync('src/hada-typographies.ts', typoMapping(hadaTokens.typographyTokens, hadaTokens));
fs.writeFileSync('src/fontWeights.ts', toTypeScript(fontWeightTokens, 'fontWeights'));
fs.writeFileSync('src/borderRadius.ts', toTypeScript(borderRadiusTokens, 'borderRadius'));
fs.writeFileSync('src/hada-colors.ts', toTypeScript(hadaTokens.colorTokens, 'hadaColors'));
fs.writeFileSync('src/shopl-colors.ts', toTypeScript(shoplTokens.colorTokens, 'shoplColors'));
fs.writeFileSync('src/spacings.ts', toTypeScript(spacingTokens, 'spacings'));


console.log('Tokens have been successfully converted to TypeScript!');
