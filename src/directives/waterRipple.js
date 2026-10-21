const bindings = new WeakMap()

// Small, short-lived rings for links. The photo uses its own refraction effect.
export default {
  mounted(element) {
    element.classList.add('water-feedback')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastTime = 0, lastX = 0, lastY = 0
    const timers = new Set()
    function ripple(event, force = false) {
      if (reduced.matches || event.pointerType === 'touch' && event.type !== 'pointerdown') return
      const now = performance.now()
      if (!force && (now-lastTime < 170 || Math.hypot(event.clientX-lastX,event.clientY-lastY)<26)) return
      lastTime = now; lastX = event.clientX; lastY = event.clientY
      const bounds = element.getBoundingClientRect()
      const ring = document.createElement('span')
      ring.className = 'water-feedback-ring'
      ring.setAttribute('aria-hidden','true')
      ring.style.left = `${event.clientX-bounds.left}px`
      ring.style.top = `${event.clientY-bounds.top}px`
      ring.style.setProperty('--ring-size',`${Math.min(220,Math.max(100,bounds.width*.6))}px`)
      element.appendChild(ring)
      const timeout = setTimeout(() => { ring.remove(); timers.delete(timeout) },1050)
      timers.add(timeout)
    }
    const enter = event => ripple(event,true)
    const move = event => ripple(event)
    element.addEventListener('pointerenter',enter)
    element.addEventListener('pointermove',move)
    element.addEventListener('pointerdown',enter)
    bindings.set(element,{enter,move,timers})
  },
  beforeUnmount(element) {
    const state = bindings.get(element)
    if (!state) return
    element.removeEventListener('pointerenter',state.enter)
    element.removeEventListener('pointermove',state.move)
    element.removeEventListener('pointerdown',state.enter)
    state.timers.forEach(clearTimeout)
    element.querySelectorAll('.water-feedback-ring').forEach(ring => ring.remove())
    bindings.delete(element)
  },
}
