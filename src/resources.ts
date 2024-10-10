import type { PlayerElement } from 'html-midi-player'
import { constants } from './constants'
import { events } from './events'
import { Sound } from './sound'

export type ResourceTypeOptions<T> = {
  class: T
  event: string
}

export class ResourceType {
  public static image: ResourceTypeOptions<typeof Image> = {
    class: Image, 
    event: 'load'
  }

  public static sound: ResourceTypeOptions<typeof Sound> = {
    class: Sound,
    event: 'load'
  }
}

export class Resources {
  private resources: (Resource<any> & {element?: any, isLoaded?: boolean, id?: number})[] = []

  constructor() {
    
  }

  public add<T extends {new(...args: any[]): any}>(resource: ResourceOptions<T>) {
    this.resources.push({
      ...resource,
      isLoaded: false,
      id: resource.id ?? this.resources.length
    } as Resource<T>)
    events.emit('ResourceAdded', resource)
  }

  public addMany(resources: ReadonlyArray<Partial<ResourceOptions<any>>>) {
    for (const resource of resources) {
      this.add(resource as Resource<any>)
    }
  }
 
  public load() {
    const queue = [...this.resources]
    const promises = []

    while (queue.length) {
      const resource = queue.shift() as Resource<any>
    
      //console.log(resource)
      resource.element = new resource.type.class() as InstanceType<typeof Image | typeof Sound>
      const {promise, resolve} = Promise.withResolvers<Resource<any>>()
      
       if (resource.type.class === Sound) {
        const sound = resource.element as Sound
        sound.load(resource.url)
         .then(() => {
           resolve(resource)
         })
       } else {
        resource.element.addEventListener('load', () => {
          resolve(resource)
        })
         resource.element.src = resource.url
       }

       promises.push(promise)
    }
    Promise.all(promises)
    .then(resources => {
        resources.forEach(resource => {
          resource.isLoaded = true
          events.emit('ResourceLoaded', resource)
        })
        events.emit('AllLoaded')
    })
  }

  public get<T extends {new(...args: any[]): any}>(name: typeof constants.media.sounds[number]['name'] | typeof constants.media.images[number]['name']): Resource<T> | undefined {
    return this.resources.find(resource => resource.name === name)
  }

  public getSound(name: typeof constants.media.sounds[number]['name']): Sound | undefined {
    return this.resources.find(resource => resource.type.class === Sound && resource.name === name)?.element 
  }

  public findAll(): Resource<any>[] {
    return this.resources
  }
}
export const resources = new Resources()


export type Resource<T extends {new(...args: any[]): any}> = {
  url: string 
  id: number 
  name: string 
  isLoaded: boolean 
  type: ResourceTypeOptions<T>
  element?: InstanceType<T>
}

type ResourceOptions<T extends {new(...args: any[]): any}> = Omit<Resource<T>, 'id' | 'element'> & {
  id?: number;
}



