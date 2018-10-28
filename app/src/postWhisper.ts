import { when } from "./whenthen"
import { Task, Event } from "mesg-js/lib/application"

import postWhisperEventAbi from "./postWhisperEvent.json"

import { ethereumServiceID, whisperServiceID, emailServiceID, sendGridAPIKey } from "./config.json"

const postWhisperEventTopic = "0xe9eac2290538d161d8267c32282c885734d2ac9610305575aae09e70d972aa3d" // should be calculated from abi

const eventPostWhisperLog: Event = {
  serviceID: ethereumServiceID,
  eventKey: 'log',
  filter: (eventKey: string, eventData: any): boolean => {
    return eventData.topics[0] == postWhisperEventTopic
  }
}

const taskDecodeLog: Task = {
  serviceID: ethereumServiceID,
  taskKey: 'decodeLog', // The task we want to execute
  inputs: (eventKey: string, eventData: any) => {
    console.log('decode log')
    return {
      ...eventData,
      abi: postWhisperEventAbi
    }
  }
}

const taskPostWhisper: Task = {
  serviceID: whisperServiceID,
  taskKey: 'post',
  inputs: (eventKey: string, eventData: any) => { // a function that returns the inputs for the send task based on the data of the event
    console.log('post whisper')
    return {
      payload: eventData.decodedData.payload,
      topic: eventData.decodedData.topic
    }
  }
}

when(eventPostWhisperLog)
  .then(taskDecodeLog)
  .then(taskPostWhisper)

console.log('Application is listening...')