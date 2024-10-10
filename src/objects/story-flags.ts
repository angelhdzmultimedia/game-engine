import { type Content } from './interactive-object'

class StoryFlags {
  public flags = new Map<string | undefined, boolean>()

  public add(flag: string) {
    this.flags.set(flag, true)
  }

  public getRelevantScenario(scenarios: Content[] = []) {
    return scenarios.find(scenario => {
      const bypass = scenario.bypass ?? []

      for (let i = 0; i < bypass.length; i++) {
        if (this.flags.has(bypass[i])) {
          return false
        }
      }

      const required = scenario.requires ?? []

      for (let i = 0; i < required.length; i++) {
        if (!this.flags.has(required[i])) {
          return false
        }
      }
      return true
    })
  }
}

export const talkedToA = 'TalkedToA'
export const talkedToB = 'TalkedToB'

export const storyFlags = new StoryFlags()