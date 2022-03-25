import React,{useCallback,useState,useEffect}  from 'react'
import Moment from 'moment';
import Button from '@atlaskit/button/standard-button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

import Textfield from '@atlaskit/textfield';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition} from '@atlaskit/modal-dialog';
import Swal from 'sweetalert2'
const CreateIssueModal = (props) => {
        const {isOpen,createIssue,toggle,allDay,startDate,endDate} = props 
        
        // const [summary,setSummary]=useState("")
        useEffect(()=>{
            console.log("Mostrando los props del modal:",props)
        },[isOpen,startDate])

  
  
    const handleCreateIssue=({summary,startDate,endDate})=>{
        console.log("Creando:",props)
        Swal.fire({
            icon: 'success',
            title: 'Tarea Agregada',
            text: `Se agregò la tarea ${summary}`,
            showConfirmButton: false,
            timer: 2500
          })
        createIssue({
            summary,
            start:startDate,
            end:endDate,
            allDay
        })
        toggle()
        cleanFields()
    }

    const cleanFields = ()=>{
        setSummary("")
    }

    return (


        <ModalTransition width="100%">
        {isOpen && (
            <Modal  onClose={() => {toggle()}}width="large">
                <ModalHeader>
                <ModalTitle>Crear actividad</ModalTitle>
                </ModalHeader>
                <Form onSubmit={handleCreateIssue}>
                {({formProps}) => (
                            <form {...formProps}>
                <ModalBody>

                        
                            <Field label="Summary" name="summary" isRequired={true}>
                                {({ fieldProps }) => (
                                <>
                                    <Textfield placeholder="" {...fieldProps} />
                                    <HelperMessage> Ingresa el título de la actividad </HelperMessage>
                                </>
                                )}
                            </Field>                         
                            <Field label="Fecha de inicio"  name="startDate" isRequired={true}
                                defaultValue={startDate}
                                >
                                {({ fieldProps }) => (
                                    <>
                                    <DateTimePicker {...fieldProps}  />
                                    <HelperMessage></HelperMessage>
                                    </>
                                )}
                            </Field>
                            <Field label="Fecha de fin"  name="endDate" isRequired={true}
                                defaultValue={endDate}
                                >
                                {({ fieldProps }) => (
                                    <>
                                    <DateTimePicker {...fieldProps}/>
                                    <HelperMessage></HelperMessage>
                                    </>
                                )}
                            </Field>
                         
                    {/* <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{display:"flex",flexDirection:"column", paddingTop:"2vh",width:"27%"}}>
                        <div style={{marginBottom: "2vh"}}>
                            <b >Fecha Programada de Inicio</b>
                            <br/>
                            <span>{startDate}</span>
                        </div>
                        <div style={{marginBottom: "2vh"}}>
                            <b >Fecha Programada de Fin</b>
                            <br/>
                            <span>{endDate}</span>
                        </div>
                        <div style={{marginBottom: "2vh"}}>
                            <b >Todo el dìa</b>
                            <br/>
                            <span>{allDay?"SI":"NO"}</span>
                        </div>
                        <b>Summary</b>
                            <TextField
                            size="small"
                            id="outlined-disabled"
                            placeholder=""
                            displayEmpty
                            autoFocus
                            value={summary}
                            onChange={(e)=> setSummary(e.target.value)} 
                            />
                        </div>
                    </div> */}
                </ModalBody>
                <ModalFooter>                        
                        <FormFooter>
                            <Button  type="button" appearance="default"  onClick={() => {toggle()}}>Cancelar</Button>
                            <Button type="submit" appearance="primary">Crear</Button>
                        </FormFooter>

                </ModalFooter>
                    </form>
                        )}
                    </Form>

            </Modal>
            )}
        </ModalTransition>
        
    )
}

export default CreateIssueModal;