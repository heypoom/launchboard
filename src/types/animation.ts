import {Spec} from './specs'

export type Scene = number[]

export interface Color {
  name: string
  web: string
  device: Spec
}
