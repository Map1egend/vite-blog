import { App } from 'vue'
import { ICONS } from './quoteAwesome'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface opt {
  name: string
}

export default function createFontAwesome(app: App<Element>, options: opt) {
  ICONS.forEach((icon) => {
    library.add(icon)
  })

  app.component(options.name, FontAwesomeIcon)
}
