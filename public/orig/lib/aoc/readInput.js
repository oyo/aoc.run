export default async () =>
  new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.id = 'overlay'
    overlay.innerHTML = `
<div class="inputarea">
  <span>
    <input type="file" id="file" />
    <button id="paste">paste</button>
    <button id="clear">clear</button>
  </span>
  <textarea id="text" placeholder="paste puzzle input or drop input file"></textarea>
  <span>
    <button id="start" disabled">start</button>
  </span>
</div>`
    document.body.appendChild(overlay)
    const inputarea = document.querySelector('textarea')
    inputarea.focus()
    inputarea.addEventListener('input', (evt) => {
      const text = evt.target.value
      if (!text || text.trim().length === 0) return
      startButton.disabled = false
    })
    const fileInput = document.getElementById('file')
    fileInput.addEventListener('change', (evt) => readFile(evt.target.files))
    document.getElementById('paste').addEventListener('click', () => paste())
    document.getElementById('clear').addEventListener('click', () => setInput(''))
    const startButton = document.getElementById('start')
    startButton.addEventListener('click', () => {
      document.body.removeChild(overlay)
      resolve(inputarea.value)
    })

    void fetch('input')
      .then((response) => (response.ok ? response.text() : ''))
      .then((data) => setInput(data))

    overlay.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
      overlay.classList.add('drag')
    })

    overlay.addEventListener('dragleave', (e) => {
      e.preventDefault()
      e.stopPropagation()
      overlay.classList.remove('drag')
    })

    overlay.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
      overlay.classList.remove('drag')
      readFile(e.dataTransfer.files)
    })

    const setInput = (text) => {
      inputarea.value = text
      inputarea.select()
      if (!text || text.trim().length === 0) {
        startButton.disabled = true
        return
      }
      document.getElementById('start').disabled = false
      startButton.disabled = false
      startButton.focus()
    }

    const readFile = (files) => {
      if (files.length === 1) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
          setInput(event.target.result)
        }
        reader.onerror = (error) => {
          console.error('error reading file:', error)
          inputarea.value = '<error reading file>'
        }
        reader.readAsText(file)
      } else {
        inputarea.value = '<please drop a single input text file>'
      }
    }

    const paste = async () => {
      try {
        const text = await navigator.clipboard.readText()
        setInput(text)
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err)
        inputarea.value = '<error reading clipboard>'
      }
    }
  })
