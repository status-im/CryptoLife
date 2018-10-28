import { when } from "./whenthen"
import { Task, Event } from "mesg-js/lib/application"
import sendEmailEventAbi from "./sendEmailEvent.json"
import { ethereumServiceID, emailServiceID, sendGridAPIKey } from "./config.json"

const sendEmailEventTopic = "0xe7c151e14f963ecb9fa45f25766502b23418c9139875e66c8dc22bbf15a878dd" // should be calculated from abi

const eventSendEmailLog: Event = {
  serviceID: ethereumServiceID,
  eventKey: 'log',
  filter: (eventKey: string, eventData: any): boolean => {
    return eventData.topics[0] == sendEmailEventTopic
  }
}
const taskDecodeLog: Task = {
  serviceID: ethereumServiceID,
  taskKey: 'decodeLog', // The task we want to execute
  inputs: (eventKey: string, eventData: any) => {
    console.log('decode log')
    return {
      ...eventData,
      abi: sendEmailEventAbi
    }
  }
}
const taskSendEmail: Task = {
  serviceID: emailServiceID, // The serviceID of the service to send emails
  taskKey: 'send', // The task we want to execute
  inputs: (eventKey: string, eventData: any) => { // a function that returns the inputs for the send task based on the data of the event
    console.log('send email')
    return {
      apiKey: sendGridAPIKey,
      from: eventData.decodedData.from,
      to: eventData.decodedData.to,
      subject: eventData.decodedData.subject,
      text: eventData.decodedData.body
    }
  }
}

when(eventSendEmailLog)
  .then(taskDecodeLog)
  .then(taskSendEmail)

console.log('Application is listening...')