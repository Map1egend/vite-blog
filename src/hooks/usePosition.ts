interface coefficient {
  left: number
  right: number
  top: number
  bottom: number
  middle: number
}

export enum Position {
  LEFT_TOP = 'left-top',
  TOP = 'middle-top',
  RIGHT_TOP = 'right-top',

  LEFT = 'left-middle',
  RIGHT = 'right-middle',

  LEFT_BOTTOM = 'left-bottom',
  BOTTOM = 'middle-bottom',
  RIGHT_BOTTOM = 'right-bottom'
}

const body = document.querySelector('body')

export default function usePosition(pos: Position = Position.LEFT_TOP, parent = body) {
  const target_pos: string[] = pos.split('-')

  const correctCoefficient = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    middle: 0.5
  }

  return function (element: HTMLElement) {
    if (parent === null) return

    const T_BOUNDING_BOX = element.getBoundingClientRect()
    const P_BOUNDING_BOX = parent.getBoundingClientRect()
    // x 补正
    const x_correction = correctCoefficient[target_pos[0] as keyof coefficient]
    // y 补正
    const y_correction = correctCoefficient[target_pos[1] as keyof coefficient]

    return {
      left: T_BOUNDING_BOX.left - P_BOUNDING_BOX.left + x_correction * T_BOUNDING_BOX.width,
      top: T_BOUNDING_BOX.top - P_BOUNDING_BOX.top + y_correction * T_BOUNDING_BOX.height
    }
  }
}
