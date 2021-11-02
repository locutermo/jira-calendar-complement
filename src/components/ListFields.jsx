import ForgeUI, {
    useState,
    Text,
    Table,
    Head,
    Cell,
    Row,
} from "@forge/ui";
import {DEFAULT_FIELD_CONFIGURATION} from '../data/constants'

const ListField=({data})=>{
    return(
        <Table>
            <Head>
                {DEFAULT_FIELD_CONFIGURATION.tableHeaders.map((e)=>(
                    <Cell><Text>{e}</Text></Cell>
                ))}
            </Head>
            {data.map(e=>(
                <Row>
                    <Cell><Text>{e.key}</Text></Cell>
                    <Cell><Text>{e.name}</Text></Cell>
                    <Cell><Text>{e.schema?e.schema.type:'No definido'}</Text></Cell>                    
                </Row>
            ))}
        </Table>
    )
}

export default ListField