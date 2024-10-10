type EventHandler = {
  id: number
  eventName: string
  caller: any
  callback: (data?: any) => void
}

class Events {
  private handlers: EventHandler[] = []
  public index: number = 0

  public emit<T>(eventName: string, data?: T) {
    this.handlers.forEach((handler) => {
      if (handler.eventName === eventName) {
        handler.callback(data)
      }
    })
  }

  public on<T>(eventName: string, caller: any, callback: (data?: T) => void) {
    this.index += 1
    this.handlers.push({
      id: this.index,
      eventName,
      caller,
      callback,
    })
    return this.index
  }

  public unsubscribe(eventName: string, caller: any) {
    this.handlers = this.handlers.filter((handler) => handler.caller !== caller && handler.eventName !== eventName)
  }

  public unsubscribeAll( caller: any) {
    this.handlers = this.handlers.filter((handler) => handler.caller !== caller)
  }


  public off(id: number) {
    this.handlers = this.handlers.filter((handler) => handler.id !== id)
  }
}

export const events = new Events()