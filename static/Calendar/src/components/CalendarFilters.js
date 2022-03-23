import React,{useState} from 'react'
import Select from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';
import styled from "styled-components"
export default function CalendarFilter(props){
    let {onChangeAssigneeFilter} = props
    const assigneeOptions=[
      { label: 'Todos', value: 'TODO' },
      { label: 'Jose Mateo', value: '60e8c686c0ea290069ed3b63' },
      { label: 'Jonathan', value: '557058:b0e5d378-3c09-4bf6-81e8-03f48830f33b' },
      { label: 'Karol', value: '5cf7e3dbc90d790e902d7001' },
      { label: 'Dessire', value: 'darw5cf7e3dceba18b0ea85a7e1din' },
      { label: 'Daniel', value: '62012a7d1fec260068c0fb8d' },
      { label: 'Ronny', value: '6230a47762dc1e006802247e' },
      { label: 'Giohanny', value: '61e824ef09633b0069ca4c24' },
      { label: 'Karen', value: '61d4ccb0bce5e00069366d16' },
      { label: 'Angie', value: 'sydney' },
    ]

    return (
        <Section>
          <FilterElement width="300">
            {/* <label htmlFor="single-select-example">Seleccione un responsable</label> */}
            <Select inputId="single-select-example" className="single-select" classNamePrefix="react-select"
              options={assigneeOptions}
              placeholder="Seleccione un responsable"
              onChange={onChangeAssigneeFilter}
            />
          </FilterElement>
          {/* <FilterElement width="150">
            <Textfield name="basic" aria-label="default text field" />;
          </FilterElement> */}
          </Section>
    )


}


const Section = styled.div`
  
  display:flex;
  flex-direction:row;
  /* Adjust the background from the properties */
  justify-content: flex-start;
  align-items: center;
  z-index:999;
  background: ${props => props.background!=null?props.background:'white'};
`

const FilterElement = styled.div`
  width: ${props => props.width+"px"};
  margin-right: 5px;

`