import Resolver from '@forge/resolver';
import {getDataFromJira} from './helpers'

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hola mundo.....!';
});

resolver.define('get-all-fields',(req) => {
  const data = getDataFromJira('/rest/api/3/field')
  return data
})

export const handler = resolver.getDefinitions();
