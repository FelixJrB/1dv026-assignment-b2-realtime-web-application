/**
 * @file Client-side WebSocket handler.
 * @author Felix Berglund
 * @module client
 * @description Connects to WebSocket server and updates DOM in real-time.
 * @see link:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * https://websockets.spec.whatwg.org/#the-websocket-interface
 */


// Create a new WebSocket connection to the server
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const basePath = window.location.pathname.startsWith('/issues-app') ? '/issues-app/' : ''
const socket = new WebSocket(`${protocol}//${window.location.host}${basePath}`)

// Connection opened
socket.addEventListener('open', () => {
  console.log('Successfully connected to WebSocket server')
  socket.send('Hello from the Server!')
})

// Empty array to store our State values in the client. 
// This allows us to have a local representation of the issues that we can manipulate and render in the DOM.
const issues = []
console.log('issues:', issues)
const openIssues = document.querySelector('#issue-list-open')
console.log('openIssues:', openIssues)
const closedIssues = document.querySelector('#issue-list-closed')
console.log('closedIssues:', closedIssues)
// Loop through our id issue list with iid and then push the data to our issues array.
document.querySelectorAll('li[data-iid]').forEach((li) => {
  issues.push({
    iid: Number(li.dataset.iid),
    state: li.dataset.state,
    title: li.dataset.title,
    author: li.dataset.author,
    avatar: li.dataset.avatar,
    description: li.dataset.description,
  })
})

/**
 * Renders the issues in the DOM based on their state (open or closed).
 * This function clears the existing issue lists and repopulates them with the current state of issues.
 */
function render () {
  openIssues.replaceChildren()
  closedIssues.replaceChildren()

  issues.forEach((issue) => {
    const li = document.createElement('li')
    li.dataset.iid = issue.iid

    if (issue.avatar) {
      const img = document.createElement('img')
      img.src = issue.avatar
      img.title = issue.author
      img.alt = ''
      img.width = 50
      li.append(img)
    }

    const text = document.createElement('span')
    text.textContent = ` ${issue.author} #${issue.iid} — ${issue.title} (${issue.state}) `
    li.append(text)

    const description = document.createElement('p')
    description.textContent = issue.description
    li.append(description)

    const button = document.createElement('button')
    if (issue.state === 'opened') {
      button.textContent = 'Close'
      button.className = 'close-btn'
      button.dataset.action = 'close'
    } else {
      button.textContent = 'Reopen'
      button.className = 'reopen-btn'
      button.dataset.action = 'reopen'
    }
    button.dataset.iid = issue.iid
    li.append(button)

    // Add the <li> to the correct list based on state
    if (issue.state === 'opened') {
      openIssues.append(li)
    } else {
      closedIssues.append(li)
    }
  })
}

render() // Initial render of the issues in the DOM

/**
 * Finds an issue by its iid in the issues array.
 *
 * @param {number|string} iid - Issue's iid.
 * @returns {object|undefined} Matching issue, or undefined.
 */
function findIssue (iid) {
  return issues.find((issue) => issue.iid === Number(iid))
}

// --- Button click events: close/reopen issues ---
document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]')
  if (!button) {
    return
  }

  const iid = button.dataset.iid
  const action = button.dataset.action

  try {
    const response = await fetch(`issues/${iid}/${action}`, { method: 'POST' })
    if (!response.ok) {
      console.error(`Failed to ${action} #${iid}`)
      return
    }
    const issue = findIssue(iid)
    if (issue) {
      issue.state = action === 'close' ? 'closed' : 'opened'
      console.log('the following action has been performed:', action, 'on issue #', iid)
      render()
    }
  } catch (error) {
    console.error(`Error trying to ${action} #${iid}:`, error)
  }
})

// --- WebSocket message events: open/update/close/reopen issues ---
socket.addEventListener('message', (event) => {
  console.log('Message received from WebSocket server:', event.data)
  let data
  try {
    data = JSON.parse(event.data)
  } catch {
    return
  }
  console.log('The reparsed data from the WebSocket server is:',data)
  
  const issue = findIssue(data.iid)

  switch (data.action) {
  case 'open':
    if (!issue) {
      issues.push({
        iid: Number(data.iid),
        state: data.state,
        title: data.title,
        author: '',
        avatar: '',
        description: data.description,
      })
      console.log('A new issue has been opened:', data)
    }
    break
  case 'update':
    if (issue) {
      issue.title = data.title
      issue.state = data.state
      issue.description = data.description
    }
    break
  case 'close':
    if (issue) {
      issue.state = 'closed'
      console.log('The issue has been closed:', issue)
    }
    break
  case 'reopen':
    if (issue) {
      issue.state = 'opened'
      console.log('The issue has been reopened:', issue)
    }
    break
  }

  render() // 
})