export interface EventRequest {
  description: string
  endDate: string
  priority: number
  startDate: string
}

export interface Event {
  eventId: number
  description: string
  start: string
  end: string
  priority: number
}

interface Activity {
  activiteType: 'restriction' | 'task'
  activiteName: string
}

type DaySchedule = Record<string, Activity>

type Schedule = Record<string, DaySchedule>

export type { Activity, DaySchedule, Schedule }
