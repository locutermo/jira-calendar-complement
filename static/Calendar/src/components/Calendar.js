import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { invoke } from '@forge/bridge';
import CreateIssueModal from './CreateIssueModal'
import "../styles.css";
export default class Calendar extends React.Component {
  calendarComponentRef = React.createRef();

  state = {
    calendarWeekends: true,
    calendarEvents: this.props.events,
    isOpenCreateModal:false,
    startSelected:"",
    endSelected:"",
    allDaySelected:true,
  };


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
      <>      
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      </>
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
      console.log('change confirmed')
      console.log(info,info.event.extendedProps.key)
      // updateAppointment is another custom method
      this.props.updateDate({key:info.event.extendedProps.key,start: info.event.start, end: info.event.end})

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
          <button onClick={this.toggleWeekends}>Mostrar/Ocultar fin de semana</button>         
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
          />
        </div>
      </div>
    );
  }

}