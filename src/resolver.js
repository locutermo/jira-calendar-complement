import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getDataJson', async () => {
    const jql = `project = "Gobierno TI Proyectos" and created > startOfYear() and "Fecha y hora de Inicio[Time stamp]" > startOfMonth()`
    const fields =`summary,customfield_10780,customfield_10781`
    const response = await api.asUser()
    .requestJira(`/rest/api/2/search?fields=${fields}&jql=${jql}`);
    return await response.json();
});

resolver.define('getDepartamentos', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_10952/context/12006/option`);
  return await response.json();
});

resolver.define('getGerente', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11658/context/12009/option`);
  return await response.json();
});

resolver.define('getTipoEjecucion', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11060/context/11675/option`);
  return await response.json();
});

resolver.define('getTipoAfectacion', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11184/context/11681/option`);
  return await response.json();
});

resolver.define('getCapaRed', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11395/context/11722/option`);
  return await response.json();
});

resolver.define('getRegion', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11654/context/12002/option`);
  return await response.json();
});

resolver.define('getElemRed', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11491/context/11820/option`);
  return await response.json();
});


resolver.define('getVentana', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_10486/context/11690/option`);
  return await response.json();
});

resolver.define('getEstadoComite', async () => {
  const response = await api.asUser()
  .requestJira(`/rest/api/2/field/customfield_11672/context/12024/option`);
  return await response.json();
});

resolver.define('getTransition',  async ({payload, context}) => {
  const respo =  await api.asUser()
  .requestJira(`/rest/api/2/issue/${payload.key}/transitions`).then(response=>response.json())
  .then(data=>data.transitions.filter(item=>{if(item.to.name===payload.estadoJira) return item})[0].id);
  return await respo;

});


resolver.define('enviarHaciaComite', async ({payload, context})  => {

  let idSustentarComite = await api.asUser().requestJira(`/rest/api/2/issue/${payload.key}/transitions`).then(response=>response.json())
    .then(data=>data.transitions.filter(item=>{if(item.to.name===payload.estadoJira) return item})[0].id);
  

  let response = await api.asUser()
  .requestJira(`/rest/api/2/issue/${payload.key}/transitions`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({  transition:{id:idSustentarComite}, update: { customfield_11674: [{ set: payload.observa }] , customfield_11672: [{ set: {value:payload.estadCo} }] } }),
  });
  return response.status;
});


export const handler = resolver.getDefinitions();
