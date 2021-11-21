const { google } = require('googleapis')
require('dotenv').config()

const CLINT_ID = process.env.CLINT_ID
const CLINT_SECRECT = process.env.CLINT_SECRECT
const REDIRECT_URI = process.env.REDIRECT_URI

function getDrive(token) {
  const oauth2Client = new google.auth.OAuth2(CLINT_ID, CLINT_SECRECT, REDIRECT_URI)

  oauth2Client.setCredentials({ access_token: token })

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client
  })

  return drive
}

module.exports = getDrive