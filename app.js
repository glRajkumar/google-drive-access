const express = require('express')
const fs = require('fs')

const getDrive = require('./getDrive')

const app = express()
app.use(express.json())

app.get('/auth', async (req, res) => {
  try {
    res.sendFile('./auth_provider.html', { root: __dirname })

  } catch (error) {
    res.send(error)
  }
})

app.get('/files/:token', async (req, res) => {
  try {
    const { token } = req.params
    const drive = getDrive(token)

    let { data } = await drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.folder'"
    })

    res.send(data)

  } catch (error) {
    res.send(error)
  }
})

app.post("/create-file/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { folderId } = req.body

    const drive = getDrive(token)

    let fileMetadata = {
      'name': 'img1.jpeg'
    };

    if (folderId) {
      fileMetadata.parents = [folderId]
    }

    let media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('./img1.jpeg')
    };

    let { data } = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id"
    })

    res.send(`File uploaded successfully, here is the id of the file - ${data.id}`)

  } catch (error) {
    console.log("error")
    res.send(error)
  }
})

app.post("/create-folder/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { folderName, folderId } = req.body

    const drive = getDrive(token)

    let fileMetadata = {
      'name': folderName,
      'mimeType': 'application/vnd.google-apps.folder'
    };

    if (folderId) {
      fileMetadata.parents = [folderId]
    }

    let { data } = await drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    });

    res.send(`Folder created successfully, here is the id of the folder - ${data.id}`)

  } catch (error) {
    console.log("error")
    res.send(error)
  }
})

app.listen(3000, () => console.log('port is listening'))