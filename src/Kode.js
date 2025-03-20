function setProperties() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperties({
    BOT_TOKEN: '1234:abcd',
    DRIVE_FOLDER_ID: '1a2b3c4d5e6f7g8h9i',
    WEBHOOK_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  });

  Logger.log('Properties set successfully.');
}

function getProperties() {
  return PropertiesService.getScriptProperties().getProperties();
}

const { BOT_TOKEN, DRIVE_FOLDER_ID, WEBHOOK_URL } = getProperties();
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

function doPost(e) {
  const update = JSON.parse(e.postData.contents);
  if (update.message) processMessage(update.message);
}

function processMessage(message) {
  if (message.text.startsWith('/')) {
    handleCommand(message);
  } else {
    handleOnMessage(message);
  }
}

function handleCommand(message) {
  const chatId = message.chat.id;
  const rootFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  let onMdContent = null;

  function getAllFiles(folder) {
    let files = [];
    let fileIterator = folder.getFiles();

    while (fileIterator.hasNext()) {
      files.push(fileIterator.next());
    }

    let subFolders = folder.getFolders();
    while (subFolders.hasNext()) {
      let subFolder = subFolders.next();
      files = files.concat(getAllFiles(subFolder));
    }

    return files;
  }

  const files = getAllFiles(rootFolder);

  for (const file of files) {
    const fileName = file.getName();

    if (fileName === 'on.md') {
      onMdContent = file.getBlob().getDataAsString();
      continue;
    }

    if (fileName.endsWith('.md')) {
      const commandName = `/${fileName.replace('.md', '')}`;
      const content = file.getBlob().getDataAsString();

      if (message.text.startsWith(commandName)) {
        if (message.chat.type !== 'private') return;

        const parts = content.split(/await\s*\d*/g).map((part) => part.trim());

        for (const part of parts) {
          if (part) {
            sendMessage(chatId, part, { parse_mode: 'Markdown' });
          }
        }
        return;
      }
    }
  }
}

function handleOnMessage(message) {
  const chatId = message.chat.id;
  const rootFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  let onMdContent = null;

  const files = rootFolder.getFilesByName('on.md');
  if (files.hasNext()) {
    onMdContent = files.next().getBlob().getDataAsString();
  }

  if (onMdContent && message.chat.type === 'private') {
    sendMessage(chatId, onMdContent, { parse_mode: 'Markdown' });
  }
}

function sendMessage(chatId, text, options = {}) {
  if (!chatId || !text) return;

  const payload = { chat_id: chatId, text: text, ...options };
  UrlFetchApp.fetch(`${API_URL}/sendMessage`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}

function setWebhook() {
  const response = UrlFetchApp.fetch(`${API_URL}/setWebhook`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ url: WEBHOOK_URL }),
  });

  Logger.log(response.getContentText());
}
