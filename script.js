const copyButton = document.getElementById('copy')
const command = document.getElementById('command')

function showCopied() {
  copyButton.classList.add('done')
  copyButton.setAttribute('aria-label', 'Copied')
  window.setTimeout(function () {
    copyButton.classList.remove('done')
    copyButton.setAttribute('aria-label', 'Copy the command')
  }, 1600)
}

function copyWithSelection(text) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  document.body.removeChild(area)
  return copied
}

if (copyButton && command) {
  copyButton.addEventListener('click', function () {
    const text = command.textContent
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        if (copyWithSelection(text)) {
          showCopied()
        }
      })
    } else if (copyWithSelection(text)) {
      showCopied()
    }
  })
}
