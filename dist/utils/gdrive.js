"use strict";

const fs = require("fs");

const {
  google
} = require("googleapis");

const {
  Logger: logger
} = require("./winston");

const config = require("../config");

const {
  CLIENT_ID,
  CLIENT_SECRET,
  GDRIVE_TOKEN,
  AUTH_CODE,
  GDRIVE_PARENT_FOLDER
} = config;
let parsedToken = null;

if (GDRIVE_TOKEN) {
  try {
    parsedToken = JSON.parse(GDRIVE_TOKEN);
  } catch (e) {
    logger.info("GDRIVE_TOKEN env not correctGDRIVE_TOKEN set to:", GDRIVE_TOKEN);
  }
}

const SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.file"];

if (!CLIENT_ID) {
  logger.info("CLIENT_ID env not set. Not uploading to gdrive.");
}

if (!CLIENT_SECRET) {
  logger.info("CLIENT_SECRET env not set. Not uploading to gdrive.");
}

if (!AUTH_CODE) {
  logger.info("AUTH_CODE env not set.");
}

if (!GDRIVE_TOKEN) {
  logger.info("GDRIVE_TOKEN env not set.");
}

if (GDRIVE_PARENT_FOLDER) {
  logger.info(`GDRIVE_PARENT_FOLDER set to ${GDRIVE_PARENT_FOLDER}`);
}

let auth = null;
let drive = null;

if (CLIENT_ID && CLIENT_SECRET) {
  authorize().then(a => {
    if (!a) return;
    auth = a;
    drive = google.drive({
      version: "v3",
      auth
    });
    logger.info("Gdrive client up");
  });
}

async function authorize() {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

  if (!AUTH_CODE) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    logger.info(`Get AUTH_CODE env by visiting this url: \n${authUrl}\n`);
    return null;
  } else if (AUTH_CODE && !GDRIVE_TOKEN) {
    return oAuth2Client.getToken(AUTH_CODE, (err, token) => {
      if (err) {
        console.error("Error retrieving access token\n", err);
        return null;
      }

      oAuth2Client.setCredentials(token);
      if (!GDRIVE_TOKEN) logger.info("Set GDRIVE_TOKEN env to:\n", JSON.stringify(token));else logger.info("Gdrive config OK.");
      return oAuth2Client;
    });
  } else if (AUTH_CODE && GDRIVE_TOKEN) {
    oAuth2Client.setCredentials(parsedToken);
    return oAuth2Client;
  } else {
    logger.info("AUTH_CODE:", !!AUTH_CODE);
    logger.info("GDRIVE_TOKEN:", !!GDRIVE_TOKEN);
  }
}

function getAuthURL(CLIENT_ID, CLIENT_SECRET) {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  return authUrl;
}

function getAuthToken(CLIENT_ID, CLIENT_SECRET, AUTH_CODE) {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
    oAuth2Client.getToken(AUTH_CODE, (err, token) => {
      err ? reject(err) : resolve(token);
    });
  });
}

function createFolder(name, parentId) {
  return new Promise((resolve, reject) => {
    var fileMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : null
    }; // prettier-ignore

    drive.files.create({
      supportsTeamDrives: true,
      resource: fileMetadata,
      fields: "id"
    }, (err, file) => err ? reject(err) : resolve(file)); // prettier-ignore
  });
}

function uploadFileStream(name, stream, parentId = GDRIVE_PARENT_FOLDER) {
  return new Promise((resolve, reject) => {
    var media = {
      body: stream
    };
    drive.files.create({
      supportsTeamDrives: true,
      resource: {
        name,
        parents: parentId ? [parentId] : null
      },
      media: media,
      fields: "id"
    }, (err, file) => err ? reject(err) : resolve(file)); // prettier-ignore
  });
}

function uploadFile(name, path, parentId = GDRIVE_PARENT_FOLDER) {
  return new Promise((resolve, reject) => {
    var media = {
      body: fs.createReadStream(path)
    };
    drive.files.create({
      supportsTeamDrives: true,
      resource: {
        name,
        parents: parentId ? [parentId] : null
      },
      media: media,
      fields: "id"
    }, (err, file) => err ? reject(err) : resolve(file)); // prettier-ignore
  });
}

async function uploadFolder(path, parentId) {
  const intr = path.split("/");
  const name = intr[intr.length - 1];

  try {
    const stat = fs.lstatSync(path);

    if (stat.isDirectory()) {
      // make a folder in gdrive
      const folder = await createFolder(name, parentId || GDRIVE_PARENT_FOLDER);
      const folderId = folder.data.id; // get list of folders contents

      const contents = fs.readdirSync(path, {
        withFileTypes: true
      });
      const uploads = contents.map(val => {
        const name = val.name;
        const isDir = val.isDirectory();
        const isFile = val.isFile(); // if dir upload dir recursively
        // else file upload the file

        if (isDir) {
          return uploadFolder(`${path}/${name}`, folderId);
        } else if (isFile) {
          return uploadFile(name, `${path}/${name}`, folderId);
        } else {
          return null;
        }
      }); // await all uploads

      await Promise.all(uploads); // return the gdrive link

      return `https://drive.google.com/drive/folders/${folderId}`;
    } else if (stat.isFile()) {
      // make a folder in gdrive
      const folder = await createFolder(name, parentId || GDRIVE_PARENT_FOLDER);
      const folderId = folder.data.id; // upload the file to drive

      await uploadFile(name, `${path}`, folderId); // return the gdrive link

      return `https://drive.google.com/drive/folders/${folderId}`;
    }
  } catch (e) {
    console.log("error", e.message);
    return null;
  }
}

async function uploadWithLog(path, parentId) {
  const intr = path.split("/");
  intr[intr.length - 1] = "gdrive.txt";
  const gdriveText = intr.join("/");
  fs.writeFileSync(gdriveText, "Upload started\n");
  const url = await uploadFolder(path, parentId);

  if (url) {
    fs.appendFileSync(gdriveText, `Gdrive url: ${url}`);
    return url;
  } else {
    fs.appendFileSync(gdriveText, `An error occured. GDRIVE_PARENT_FOLDER: ${GDRIVE_PARENT_FOLDER}`);
    return null;
  }
}

function getFiles(folderId) {
  let query;
  const parent = folderId || GDRIVE_PARENT_FOLDER;
  if (parent) query = `'${parent}' in parents and trashed = false`;else query = "trashed = false";
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: query,
      pageSize: 1000,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      fields: "nextPageToken, files(id, name, modifiedTime, iconLink, mimeType)"
    }, (err, res) => err ? reject(err) : resolve(res.data.files));
  });
}

function sendFileStream(req, res) {
  const fileId = req.query.id || req.params.id;
  if (!fileId) res.sendStatus(404);
  drive.files.get({
    fileId,
    alt: "media"
  }, {
    responseType: "stream",
    ...req.headers
  }, (err, resp) => {
    if (!err) {
      Object.keys(resp.headers).forEach(val => {
        res.setHeader(val, resp.headers[val]);
      });
      resp.data.on("end", () => {}).on("error", () => {}).pipe(res);
    } else {
      console.log("error ", err);
      res.end();
    }
  });
}

module.exports = {
  uploadFolder,
  uploadFileStream,
  uploadFile,
  uploadWithLog,
  getFiles,
  sendFileStream,
  getAuthURL,
  getAuthToken
};