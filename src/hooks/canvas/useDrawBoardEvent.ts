import Brush from '@utils/brush'

export default function useDrawBoardEvent(brush: Brush) {
  const ctrlZ_reVoke: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    // ctrlKey: boolean 和 metaKey: boolen 分别对应 ctrl 和 ⌘
    if (e.code === 'KeyZ' && (e.ctrlKey || (e.metaKey && !e.shiftKey))) {
      brush.revoke()
    }
  }

  const ctrlY_cancelRevoke: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if ((e.code === 'KeyY' && e.ctrlKey) || (e.code === 'KeyZ' && e.metaKey && e.shiftKey)) {
      brush.cancaelRevoke()
    }
  }

  const keyboardEvents: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    ctrlZ_reVoke(e)
    ctrlY_cancelRevoke(e)
  }

  return {
    keyboardEvents
  }
}
