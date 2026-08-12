/**
 * @file Client-side WebSocket handler.
 * @author Felix Berglund
 * @description Connects to WebSocket server and updates DOM in real-time.
 * @see link:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * https://websockets.spec.whatwg.org/#the-websocket-interface
 */

// Create a new WebSocket connection to the server
const socket = new WebSocket(`ws://${window.location.host}`)

// Connection opened
socket.addEventListener('open', () => {
  console.log('Successfully connected to WebSocket server')
  socket.send('Hello from the Server!')
})

// Listen for messages from the WebSocket server
socket.addEventListener('message', (event) => {
  console.log('Message received from WebSocket server:', event)
  try {
    const reparsedData = JSON.parse(event.data)
    console.log('Reparsed data:', reparsedData)

    switch ( reparsedData.action ) {
    case 'open': {
      const newIssue = document.createElement('li')
      newIssue.textContent = `#${reparsedData.iid} — ${reparsedData.title} (${reparsedData.state})`
      newIssue.dataset.iid = reparsedData.iid
      issueList.append(newIssue)
      break
    }
    case 'update': {
      const updatedIssue = document.querySelector(`li[data-iid='${reparsedData.iid}']`)
      if (updatedIssue) {
        updatedIssue.textContent = `#${reparsedData.iid} — ${reparsedData.title} (${reparsedData.state})`
      }
      break
    }
    case 'close': {
      const closedIssue = document.querySelector(`li[data-iid='${reparsedData.iid}']`)
      if (closedIssue) {
        closedIssue.remove()
      }
      break
    }
    }
  } catch (error) {
    console.log('Error reparsing data:', error)
  }
})

/**
 * Adds click event listeners to buttons for closing or reopening issues.
 * When a button is clicked, it sends a POST request to the server to update the issue state.
 * 
 * @param {*} selector - The CSS selector for the buttons to attach the event listeners to.
 * @param {*} action - The action to perform ('close' or 'reopen') when the button is clicked.
 */
function buttonSelection(selector, action) {
  const buttons = document.querySelectorAll(selector)
  buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const issueId = event.target.dataset.iid
      try {
        const response = await fetch(`/issues/${issueId}/${action}`, {
          method: 'POST',
        })
        if (response.ok) {
          event.target.closest('li').remove()
          console.log(`#${issueId} ${action} successfully`)
        } else {
          console.error(`Failed to ${action} #${issueId}`)
        }
      } catch (error) {
        console.error('Error closing issue:', error)
      }
    })
  })
}



const issueList = document.querySelector('#issue-list')
buttonSelection('.close-btn', 'close')
buttonSelection('.reopen-btn', 'reopen')
