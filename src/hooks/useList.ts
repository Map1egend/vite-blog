interface conf {
  DRAW_TOOLS_PANEL_LIST: panelData[]
}

const listConf: conf = {
  DRAW_TOOLS_PANEL_LIST: [
    {
      name: '画笔',
      icon: 'fa-solid fa-brush',
      value: 'tool-panel-brush',
      id: 'tool-panel-brush',
      children: [
        {
          name: 'pencil',
          icon: 'fa-solid fa-pencil',
          value: 'brush-pencil',
          id: 'brush-pencil'
        },
        {
          name: 'pencil-ruler',
          icon: 'fa-solid fa-pen-ruler',
          value: 'brush-pen-ruler',
          id: 'brush-pen-ruler'
        },
        {
          name: 'circle',
          icon: 'fa-solid fa-circle',
          value: 'brush-circle',
          id: 'brush-circle'
        },
        {
          name: 'square',
          icon: 'fa-solid fa-square',
          value: 'brush-square',
          id: 'brush-square'
        }
      ]
    }
  ]
}

export default function useList(name: string) {
  let result = null
  if (Object.prototype.hasOwnProperty.call(listConf, name)) {
    result = listConf[name as keyof conf]
  }

  return result
}
