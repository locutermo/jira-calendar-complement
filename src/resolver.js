import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getDataJson', async () => {
    const jql = `project = "Gobierno TI Proyectos" and created > startOfYear() and "Fecha y hora de Inicio[Time stamp]" > startOfMonth()`
    const fields =`summary,customfield_10780,customfield_10781,assignee`
    const response = await api.asUser()
    .requestJira(`/rest/api/2/search?fields=${fields}&jql=${jql}`);
    return await response.json();
});

resolver.define('updateDateIssue',async ({payload,context})=>{  
  let response = await api.asUser()
    .requestJira(`/rest/api/2/issue/${payload.key}`,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({fields:{
        customfield_10780:payload.start,
        customfield_10781:payload.end
      }}),
    });
  
    return response
});

resolver.define('createIssue',async ({payload,context})=>{
  let response = await api.asUser()
    .requestJira(`/rest/api/2/issue`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({fields:{
        project: {key:"GOBII"},
        issuetype:{id:10114},
        summary:payload.summary,
        customfield_10780:payload.start,
        customfield_10781:payload.end,
        assignee:{accountId:payload.accountId}
      }})
    })

    return response
})


resolver.define('getTransition',  async ({payload, context}) => {
  const respo =  await api.asUser()
  .requestJira(`/rest/api/2/issue/${payload.key}/transitions`).then(response=>response.json())
  .then(data=>data.transitions.filter(item=>{if(item.to.name===payload.estadoJira) return item})[0].id);
  return await respo;

});


export const handler = resolver.getDefinitions();
