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
      date:e.fields.customfield_10780
    }))
    return data
  }

  return (
    <>
      {loading?(<span>Cargando...</span>):(<Calendar events={data} />)}
    </>
  )
}

export default App