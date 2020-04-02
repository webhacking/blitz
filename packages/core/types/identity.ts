export type EntityId = number | string | null

export type UserContext = {
  id: EntityId
  roles: string[]
  [prop: string]: any
}
