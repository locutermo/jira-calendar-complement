import React,{useCallback,useState,useEffect}  from 'react'
import Moment from 'moment';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { invoke } from '@forge/bridge';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition} from '@atlaskit/modal-dialog';
import Swal from 'sweetalert2'
const CreateIssueModal = (props) => {
        const {isOpen,createIssue,toggle,startDate} = props 
        const [summary,setSummary]=useState("")
        useEffect(()=>{
            console.log("Mostrando los props del modal:",props)
        },[isOpen,startDate])

  
  
    const handleCreateIssue=(props)=>{
        Swal.fire({
            icon: 'success',
            title: 'Cambios Actualizados',
            text: 'Se realizaron los cambios requeridos con éxito',
            showConfirmButton: false,
            timer: 2500
          })
        createIssue({
            summary,
            start:startDate
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
            <ModalTitle>FORMULARIO DE REGISTRO</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div style={{display:"flex",flexDirection:"column", paddingTop:"2vh",width:"27%"}}>
                    <div style={{marginBottom: "2vh"}}>
                            <b >Fecha Programada de Inicio</b>
                            <br/>
                            <span>{startDate}</span>
                    </div>
                      <b>Summary</b>
                        <TextField
                        size="small"
                        id="outlined-disabled"
                        placeholder="Escriba sus observaciones ..."
                        displayEmpty
                        autoFocus
                        value={summary}
                        onChange={(e)=> setSummary(e.target.value)} 
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                    <Button sx={{color:"rgb(21,101,192)"}} variant="outlined"  onClick={() => {toggle()}}>
                    Cancelar
                    </Button>
                    <Button sx={{backgroundColor:"rgb(21,101,192)"}} variant="contained" onClick={()=>{handleCreateIssue()}}>Guardar</Button>                
            </ModalFooter>
            </Modal>
            )}
        </ModalTransition>
        
    )
}

export default CreateIssueModal;