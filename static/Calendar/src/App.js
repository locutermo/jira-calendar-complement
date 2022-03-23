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
      let temp = data.map(e=>{ 
        if(e.extendedProps.key==key){
          return {
            ...e,
            start:e.start,
            end:e.end
          }
        }
      })
      setData(temp)     
    })
  }

  const handleCreateIssue=({summary,start,end,allDay})=>{    
    invoke('createIssue',{summary,start,end}).then(res=>{
      if(res.status==201){
        setData(data.concat({
          title:summary,
          start,
          end,
          accountId:assigneeFilterSelected
        }))
      }
    })
  }

  const onChangeFilter=(e)=>{    
    setAssigneeFilterSelected(e.value)
  }

  return (
    <>
      {loading?(<span>Cargando...</span>):(
        <div className="container">
          <CalendarFilter events={data} onChangeAssigneeFilter={onChangeFilter}></CalendarFilter>          
          <Calendar createIssue={handleCreateIssue} updateDate={props=>{handleUpdateDate(props)}} events={
            assigneeFilterSelected=="TODO"?data:data.filter(e=>e.extendedProps.fields.assignee!=null?e.extendedProps.fields.assignee.accountId==assigneeFilterSelected:false)
          } />
        </div>        
         )}
    </>
  )



}

export default App