import ForgeUI, {
  useState, 
  StatusLozenge,
  Strong,
  TextField,
  Form,
  Text, IssuePanel,Table,Cell,Row,Head,useProductContext ,useEffect,SectionMessage,
  Button,
  Fragment
} from "@forge/ui";
import {getDataFromJira,addCommentToIssue,getProjects,getRoles,getTransitions, addUserToProject,updateTransition} from './helpers'
import {DEFAULT_MESSAGES_USER_ROLE} from './data/constants'
export const IssuePanelUser = () => {
  const {
    platformContext: { issueKey, projectKey }
  } = useProductContext();

  const [issue] = useState(() => getDataFromJira(`/rest/api/3/issue/${issueKey}`));
  const [users] = useState(() => getDataFromJira(`/rest/api/3/users/search`));
  const [transitions] = useState(() => getTransitions(issue.key))
  const [projects] = useState(()=> getProjects())  
  const [isSearched,setIsSearched] = useState(false)
  const [usersFound,setData] = useState(null)
  const [showMessage,setShowMessage] = useState(false)
  const [message,setMessage] = useState('')

  const validate=()=>{    
    let temp = []
    let {customfield_10271,summary} = issue.fields    
    users.forEach(user=>{
      if(user.displayName.toUpperCase().includes(summary.toUpperCase()) || (user.emailAddress!=undefined && user.emailAddress!=null?user.emailAddress.toUpperCase()==customfield_10271:false)){
        temp.push(user)
      }
    })
    
    setIsSearched(true)
    setData(temp)
  }

  const onSubmit = async ({accountId}) => {
    let temp
    
    if(accountId.trim()!="") {      
      const data = await Promise.all(
        issue.fields.customfield_10270.map( async (rol) => {
          temp = await addUserToSquad(issue.fields.summary,accountId,rol.value)          
          return temp
        })     
      )      
    }
  };

  const addSuccessComentToIssue=async ()=>{
    let roles = []
    issue.fields.customfield_10270.forEach(e=>{
      roles.push(e.value)
    })    
    await addCommentToIssue(issue.key,DEFAULT_MESSAGES_USER_ROLE.getSuccessMessage(issue.fields.reporter.displayName,issue.fields.summary,issue.fields.customfield_11261.value,roles.join(',')))      
  }

  const addUserToSquad = async (displayName,accountId,roleName,isMainRole=false)=>{          
    let project,roleId,transitionId,response,aux    
    let {customfield_11261} = issue.fields
    projects.forEach(p=>{if(p.name==customfield_11261.value) project = p })    
    const roles =  await getRoles()    
    roles.forEach(p=>{if(p.name == roleName) roleId = p.id})
    response = await addUserToProject(accountId,project.key,roleId)    
    if(response.status==200){
      if(isMainRole){
        transitions.forEach(e=>{if(e.name=="Done")transitionId = e.id})      
        response = await updateTransition(issue.key,"Done",transitionId)
        response = await addCommentToIssue(issue.key,DEFAULT_MESSAGES_USER_ROLE.getSuccessMessage(issue.fields.reporter.displayName,displayName,project.name,roleName))      
      }
      
      
      setShowMessage(true)
      setMessage(DEFAULT_MESSAGES_USER_ROLE.getSuccessMessage(issue.fields.reporter.displayName,displayName,project.name,roleName))      
      
    }else{
      setShowMessage(true)
      setMessage(DEFAULT_MESSAGES_USER_ROLE.getErrorMessage(displayName,project.name,roleName))            
    }


  }
  


  const renderResume = ()=>{
      if(usersFound!=null){
        return (
        <Fragment>
          <Text><Strong>Coincidencias</Strong></Text>
          <Table>
          <Head>
            <Cell><Text>ID</Text></Cell>
            <Cell><Text>Nombre</Text></Cell>  
            <Cell><Text>Correo</Text></Cell>     
            <Cell><Text>Estado</Text></Cell>     
            <Cell><Text></Text></Cell>     
            
          </Head>
          {usersFound.map(e=>(
            <Row>
              <Cell><Text>{e.accountId}</Text></Cell>          
              <Cell><Text>{e.displayName}</Text></Cell>          
              <Cell><Text>{e.emailAddress?e.emailAddress:"Oculto"}</Text></Cell>       
              <Cell><Text>{e.active?<StatusLozenge text="Activo" appearance="inprogress" />:<StatusLozenge text="Desactivado" appearance="removed" />}</Text></Cell>                   
              <Cell><Button text="Agregar Rol" onClick={()=>addUserToSquad(e.displayName,e.accountId,issue.fields.customfield_10270.value,true)} /></Cell>        
              <Cell><Button text="Agregar Rol por defecto" onClick={()=>addUserToSquad(e.displayName,e.accountId,'Team Member')} /></Cell>        
            </Row>
          ))}          
          </Table>
        </Fragment>)
      }else{
        <Text>No se encontró coincidencias</Text>
      }
  }

  const renderDetail =()=>{
    
    return (
      <Table>
        <Head>
          <Cell><Text>Correo</Text></Cell>
          <Cell><Text>Nombre</Text></Cell>  
          <Cell><Text>Validar</Text></Cell>        
        </Head>
        <Row>
          <Cell><Text>{issue.fields.customfield_10271}</Text></Cell>          
          <Cell><Text>{issue.fields.summary}</Text></Cell>          
          <Cell><Button text="Validar" onClick={validate} /></Cell>        
        </Row>
      </Table>
    )
  }

  const renderInfo=()=>{
    return (
      <Fragment>
        <Form  onSubmit={onSubmit} submitButtonText="Asignar">
          <TextField name="accountId" placeholder="ID de Usuario"/>
        </Form>
        <Button text="Agregar comentario" onClick={addSuccessComentToIssue} />
      </Fragment>
      
    )
  }

  return (
    <IssuePanel>      
      {/* {renderDetail()} */}
      {/* {isSearched?renderResume():null}       */}
      {renderInfo()}
      {showMessage?(
        <SectionMessage title="Info" appearance="info">
          <Text>{message}</Text>          
        </SectionMessage>
      ):null}
    </IssuePanel>
  );
};



