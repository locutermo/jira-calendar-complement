import React, { useEffect, useState,Fragment } from 'react';
import {requestJira } from '@forge/bridge';
import Spinner from '@atlaskit/spinner';
import Textfield from '@atlaskit/textfield';
import ListField from './components/ListField'
import fieldsData from './data/fields.json'
function App() {
  const [data, setData] = useState(null);
  const [fields,setFields] = useState([]);
  const [search,setSearch] = useState("");
  const getFields = async ()=>{
    const response = await requestJira('/rest/api/3/field')  
    setFields(await response.json())
    return response
}

  useEffect(() => {
    getFields();
  }, []);

  const onSearch = (e) => {
    setSearch(e.target.value)
  };

  const renderFieldList=()=>{
    let temp = [];
    fields.forEach(e => {
      if(e.name.toUpperCase().trim().includes(search.toUpperCase().trim()) ||
      (e.schema!=undefined && e.schema!=null?e.schema.type.toUpperCase().trim().includes(search.toUpperCase().trim()) : false) ||
      e.id.toUpperCase().trim().includes(search.toUpperCase().trim()) 
       ){
        temp.push(e)
      }
    }) 

    if(search.trim()==""){
      return (
        <ListField data={fields}/>
      )
    }else{
      return(
        <ListField data={temp}/>
      )
    }
  }


  

  return (
    <Fragment>      
      <div className="container py-10 min-w-full align-middle">
        <Textfield name="basic" aria-label="default text field" placeholder="Buscar" onChange={onSearch}/>        
      </div>
      {fields?renderFieldList():<Spinner/>}
    </Fragment>
  );
}

export default App;
