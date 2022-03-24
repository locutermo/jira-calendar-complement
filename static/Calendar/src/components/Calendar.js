import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NewFeature16Icon from '@atlaskit/icon-object/glyph/new-feature/16'
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { invoke } from '@forge/bridge';
import CreateIssueModal from './CreateIssueModal'
import styled from 'styled-components'
import "../styles.css";
export default class Calendar extends React.Component {
  calendarComponentRef = React.createRef();

  state = {
    calendarWeekends: false,
    calendarEvents: this.props.events,
    isOpenCreateModal:false,
    startSelected:"",
    endSelected:"",
    allDaySelected:true,
  };

componentWillUpdate(nextProps, nextState) {
    if(this.state.calendarEvents!=nextProps.events){
      this.setState({calendarEvents:nextProps.events})
    }
}


  toggleCreateModal=()=>{
    this.setState({
      isOpenCreateModal:!this.state.isOpenCreateModal
    })
  }

  handleCreateIssue=({summary,start,end,allDay})=>{
    this.setState({          
          calendarEvents: this.state.calendarEvents.concat({            
            title: summary,
            start: start,  
            end:end,
            allDay          
          })
        });
    this.props.createIssue({summary,start,end,allDay})
  }

  renderEventInfo=(eventInfo)=>{
    return(
      <EventItem>      
       <NewFeature16Icon label="issuetype" />
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      </EventItem>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleEvents = (events) => {
    this.setState({
      calendarEvents: events
    })
  }

  handleEventClick = (clickInfo) => {
    if (confirm(`Estas seguro de eliminar la tarea '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  handleEventDrop = (info) => {
    if(window.confirm("Estas seguro que quieres cambiar la fecha de evento?")){      
      console.log(info,info.event.extendedProps.key)
      // updateAppointment is another custom method
      this.props.updateDate({key:info.event.extendedProps.key,start: info.event.startStr, end: info.event.endStr})

    } else {
        console.log('change aborted')
    }
  }

  toggleWeekends = () => {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    });
  };

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2022-03-01"); // call a method on the Calendar object
  };

  handleDateSelect = (selectInfo) => {
    // let title = prompt('Please enter a new title for your event')
    this.setState({startSelected:selectInfo.startStr,endSelected:selectInfo.endStr,allDaySelected:selectInfo.allDay})
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect()
    this.toggleCreateModal()  

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   })
    // }
  }

  handleDateClick = arg => {
    this.setState({startSelected:arg.dateStr})
    console.log(arg)
    this.toggleCreateModal()  
    // if (confirm("Quieres agregar una actividad con fecha " + arg.dateStr + " ?")) {
    //   this.setState({
    //     // add new event data
    //     calendarEvents: this.state.calendarEvents.concat({
    //       // creates a new array
    //       title: "New Event",
    //       start: arg.date,
    //       allDay: arg.allDay
    //     })
    //   });
    // }
  };

  



  render() {
    return (
      <div className="calendar-app">
        <div className="calendar-app-top">
          {/* <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
          <button onClick={this.gotoPast}>go to a date in the past</button> */} 
          {/* <Button appearance="primary" onClick={this.toggleWeekends}>Mostrar/Ocultar fin de semana</Button> */}
        </div>
        <div className="calendar-app-calendar">
          <CreateIssueModal startDate={this.state.startSelected} endDate={this.state.endSelected} allDay={this.state.allDaySelected}
           createIssue={this.handleCreateIssue} isOpen={this.state.isOpenCreateModal} toggle={this.toggleCreateModal}/>                      
          <FullCalendar
            defaultView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            editable={true}
            locale='es'
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            selectable={true}
            select={this.handleDateSelect}
            selectMirror={true}
            dayMaxEvents={true}
            ref={this.calendarComponentRef}
            eventContent={this.renderEventInfo}
            weekends={this.state.calendarWeekends}
            events={this.state.calendarEvents}
            eventClick={this.handleEventClick}
            // eventsSet={this.handleEvents}
            eventDrop={this.handleEventDrop}
            
            eventLimit
            slotDuration={{ minutes: 30 }}
            slotLabelInterval={{ hours: 1 }}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: true,
              hour12: true,
              omitZeroMinute: true,

            }}
            slotMinTime={{hours:8}}
            slotMaxTime={{hours:23}}
            columnHeaderFormat={{ weekday: "long" }}
            buttonText={{
              today:    'Hoy',
              month:    'Mes',
              week:     'Semana',
              day:      'Dìa',
              list:     'Lista'
            }}
            // Event attributes
            eventColor={'#378006'}
            //eventBackgroundColor={'orange'}
            //eventTextColor={'red'}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
              hour12: true,
              omitZeroMinute: true,
            }}
            resources= {[
              { id: 'a', title: 'Room A' },
              { id: 'b', title: 'Room B' }
            ]}
            eventDidMount={(arg)=>{
              console.log("ARG:",arg.el)
              return <Tooltip content="Hello World">
                {arg.el}
                </Tooltip>
              }}
          />
        </div>
      </div>
    );
  }

}

const EventItem = styled.div`
  padding: 1px;
  & > b {
    margin-right: 2px;
    margin-left: 2px;
  }
`