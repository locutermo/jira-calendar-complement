import ForgeUI, {
    render,
    useEffect,
    Form,
    AdminPage,
    TextField,
    Text,
    useState,
    Tabs, Tab,
} from '@forge/ui';
import ListField from './components/ListFields'
import {getDataFromJira} from './helpers'
export const AdminPageConfig = () => {
    const [fieldsData] = useState(() => getDataFromJira("/rest/api/3/field"));
    const [search,setSearch] = useState('')


    const onSubmit = async ({search}) => {
        setSearch(search)
      };


    const renderFields=()=>{
        if(search.trim()==""){
            return <ListField data={fieldsData}/>
        }else{            
            let temp = []
            fieldsData.forEach(e => {                
                if(e.name.toUpperCase().includes(search.trim().toUpperCase()) || e.key.toUpperCase().includes(search.trim().toUpperCase()) || (e.schema?(e.schema.type.toUpperCase().includes(search.trim().toUpperCase())):false)){
                    temp.push(e)
                }
            });
            return <ListField data={temp}/>
        }
    }

    return (
        <AdminPage>
            <Tabs>
                <Tab label="Detalle de campos">   
                    <Form onSubmit={onSubmit} submitButtonText="Buscar">
                        <TextField name="search" placeholder="Buscar"/>
                    </Form>                                
                    {renderFields()}
                </Tab>
                <Tab label="Configuración de Atención de alta de usuario">
                    <Text>World!</Text>
                </Tab>
            </Tabs>
        </AdminPage>
    );
};


