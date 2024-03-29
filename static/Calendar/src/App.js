import React,{useEffect,useState} from 'react'
import Calendar from './components/Calendar'
import { invoke } from '@forge/bridge';
import CalendarFilter from './components/CalendarFilters';
function App(){
  const [data,setData] = useState([])  
  const [loading,setLoading] = useState(true)
  const [assigneeFilterSelected,setAssigneeFilterSelected] = useState('TODO')

  useEffect(()=>{
    invoke('getDataJson').then(res=>{
      console.log("Render:",res.issues)
      setData(formatIssue(res.issues))      
      setLoading(false);  
    })
  },[])

  const formatIssue=(issues)=>{
    let data = issues.map(e=>({
      title:e.fields.summary,
      start:e.fields.customfield_10780,
      end:e.fields.customfield_10781,      
      extendedProps: {...e}
    }))
    return data
  }

  const handleUpdateDate=({key,start,end})=>{    
    invoke('updateDateIssue',{key,start,end}).then(res=>{
      console.log("Response update:",res)
      console.log("Todos",data,key,start,end)
      setData(data.map(e=>{ 
        if(e.extendedProps.key==key){
          return {
            title:e.title,            
            start,
            end,
            extendedProps:e.extendedProps
          }
        }else return e
      }))     
    })
  }

  const handleDeleteDate=((key)=>{
    console.log(`Se eliminará el issue ${key}`)
    invoke('cancelDateIssue',{key:key}).then(res=>{
      console.log("Response Cancel Issue",res)
    })
  })

  const handleCreateIssue=({summary,start,end,allDay})=>{    
    invoke('createIssue',{summary,start,end,accountId:assigneeFilterSelected=="TODO"?null:assigneeFilterSelected}).then(res=>{
      console.log("Response Create issue",res)
      console.log("RESt:",res,"STATUS:",res.status)
      // if(res.status==201){
        setData(data.concat({
          title:summary,
          start,
          end,
          extendedProps:{
            key:res.key,
            id:res.id,
            self:res.self,
            fields:{
              summary,
              assignee: assigneeFilterSelected=="TODO"?null:{                
                accountId:assigneeFilterSelected
              },
              customfield_10780:start,
              customfield_10781:end,
            }
          }
        }))
      // }
    })
  }

  const onChangeFilter=(e)=>{    
    setAssigneeFilterSelected(e.value)
    console.log(data,e)
  }


  return (
    <>
      {loading?(<span>Cargando...</span>):(
        <div className="container">          
          <CalendarFilter events={data} onChangeAssigneeFilter={onChangeFilter}></CalendarFilter>          
          <Calendar createIssue={handleCreateIssue} deleteDate={props=>{handleDeleteDate(props)}} updateDate={props=>{handleUpdateDate(props)}} events={
            assigneeFilterSelected=="TODO"?data:data.filter(e=>e.extendedProps.fields.assignee!=null?e.extendedProps.fields.assignee.accountId==assigneeFilterSelected:false)
          } />
        </div>        
         )}
    </>
  )



}

export default App