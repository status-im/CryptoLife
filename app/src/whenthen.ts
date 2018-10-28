import { application as MESG } from "mesg-js"
import Application, { Result, Task, Event } from "mesg-js/lib/application"

interface Thenable {
  then(task: Task): Thenable
}

const mesg = MESG()

class When {
  private event: Event
  private tasks: Task[]
  private tag: string

  constructor(event: Event) {
    this.event = event
    this.tasks = []
    this.tag = (Math.floor(Math.random() * Math.floor(99999))).toString()
  }

  then(task: Task): Thenable {
    task.tags = [this.tag]
    this.tasks.push(task)
    
    if (this.tasks.length === 1) {
      mesg.whenEvent(this.event, task)
      .then(stream => {
        stream.on('error', console.error)
      })
      .catch(console.error)
    } else {
      const lastTask = this.tasks[this.tasks.length - 2]
      mesg.whenResult({
        serviceID: lastTask.serviceID,
        taskKey: lastTask.taskKey,
        tagFilters: [this.tag]
      }, task)
      .then(stream => {
        stream.on('error', console.error)
      })
      .catch(console.error)
    }

    return this
  }
}

const when = (event: Event): When => new When(event)

export { when, When }