import { render } from 'solid-js/web'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './index.css'
import './megon-ported/styles/session-review.css'
import './megon-ported/styles/diff-changes.css'
import App from './App.tsx'
import { AppProviders } from './context/AppProviders'
import { ErrorBoundary } from 'solid-js'

const bootSplash = document.getElementById('boot-splash')
function hideBootSplash() {
  if (!bootSplash) return
  bootSplash.classList.add('boot-splash-hidden')
  bootSplash.addEventListener(
    'transitionend',
    () => {
      bootSplash.remove()
    },
    { once: true },
  )
  setTimeout(() => {
    if (bootSplash.isConnected) bootSplash.remove()
  }, 500)
}

window.addEventListener('error', (event) => {
  console.error('[megon] uncaught error', event.error ?? event.message)
})
window.addEventListener('unhandledrejection', (event) => {
  console.error('[megon] unhandled rejection', event.reason)
})

try {
  render(
    () => (
      <ErrorBoundary
        fallback={(err) => {
          const message = String(err)
          const stack = (err as Error)?.stack ?? ''
          console.error('[megon] error boundary caught:', message, stack)
          return (
            <div style={{ color: 'red', padding: '20px', background: 'black' }}>
              <h1>FATAL ERROR</h1>
              <pre>{message}</pre>
              <pre>{stack}</pre>
            </div>
          )
        }}
      >
        <AppProviders>
          <App />
        </AppProviders>
      </ErrorBoundary>
    ),
    document.getElementById('root')!,
  )
} catch (err) {
  console.error('[megon] render() threw', err)
  const root = document.getElementById('root')
  if (root) {
    root.style.cssText = "color:red;padding:20px;background:black;font-family:monospace"
    const h1 = document.createElement('h1')
    h1.textContent = 'RENDER FAILED'
    root.appendChild(h1)
    const pre1 = document.createElement('pre')
    pre1.textContent = String(err)
    root.appendChild(pre1)
    const pre2 = document.createElement('pre')
    pre2.textContent = (err as Error)?.stack ?? ''
    root.appendChild(pre2)
  }
} finally {
  requestAnimationFrame(hideBootSplash)
}

setTimeout(() => {
  if (bootSplash?.isConnected) {
    console.warn('[megon] boot splash force-removed after timeout')
    bootSplash.remove()
  }
}, 10000)
