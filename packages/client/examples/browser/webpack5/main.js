import { Web3Storage } from 'web3.storage'

const form = document.querySelector('#upload-form')
const filepicker = document.querySelector('#filepicker')
const tokenInput = document.querySelector('#token')
const output = document.querySelector('#output')

showMessage('> ⁂ waiting for form submission...')

showMessage('> 📦 creating web3.storage client')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg1ODBBQTYyMDczZUJERjI4RTY3ODQxRDg5YzM4M0NkRWFmNWIwY0UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDIxNzE0MTA0ODMsIm5hbWUiOiJJbmR5VmVyc2UvV2ViMy5zdG9yYWdlIGxvY2FsIn0.lcaTOY5hgrps_sf-RJjO8spN30TICHw5mZ4m2810Xyk'
const client = new Web3Storage({ token })
showMessage('> 📦 access web3.storage client as window.web3')
window.web3 = client
parent.wweb3p = client
console.log(window.web3)
form.addEventListener('submit', async function (event) {
  // don't reload the page!
  event.preventDefault()

  showMessage('> 📦 creating web3.storage client')
  const token = tokenInput.value
  const client = window.web3

  showMessage('> 🤖 chunking and hashing the files (in your browser!) to calculate the Content ID')
  const files = filepicker.files
  const cid = await client.put(files, {
    onRootCidReady: (localCid) => {
      showMessage(`> 🔑 locally calculated Content ID: ${localCid} `)
      showMessage('> 📡 sending files to web3.storage ')
    },
    onStoredChunk: (bytes) => showMessage(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
  })
  showMessage(`> ✅ web3.storage now hosting ${cid}`)
  showLink(`https://dweb.link/ipfs/${cid}`)

  showMessage('> 📡 fetching the list of all unique uploads on this account')
  let totalBytes = 0
  for await (const upload of client.list()) {
    showMessage(`> 📄 ${upload.cid}  ${upload.name}`)
    totalBytes += upload.dagSize || 0
  }
  showMessage(`> ⁂ ${totalBytes.toLocaleString()} bytes stored!`)
}, false)

function showMessage(text) {
  const node = document.createElement('div')
  node.innerText = text
  output.appendChild(node)
}

function showLink(url) {
  const node = document.createElement('a')
  node.href = url
  node.innerText = `> 🔗 ${url}`
  output.appendChild(node)
}
