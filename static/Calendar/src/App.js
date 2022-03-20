import React,{useEffect,useState} from 'react'
import Calendar from './components/Calendar'
import { invoke } from '@forge/bridge';

function App(){
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    invoke('getDataJson').then(res=>{
      setData(formatIssue(res.issues))
      console.log(formatIssue(res.issues))
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
    console.log("DATA: ",key,start,end)
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
     console.log("Data respuesta: ",res)
    })
  }

  return (
    <>
      {loading?(<span>Cargando...</span>):(<Calendar updateDate={props=>{handleUpdateDate(props)}} events={data} />)}
    </>
  )



}

export default App