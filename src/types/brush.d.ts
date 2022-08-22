declare type strokeColor = string | CanvasGradient | CanvasPattern

declare interface panelData {
  name: string
  icon?: string
  id: string
  value: string | number
  children?: panelData[]
}
