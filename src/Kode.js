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

  if (update.message) {
    processMessage(update.message);
  } else if (update.callback_query) {
    handleCallback(update.callback_query);
  }
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
  let hearsContent = null;

  const filesHears = rootFolder.getFilesByName('hears.md');
  if (filesHears.hasNext()) {
    hearsContent = filesHears.next().getBlob().getDataAsString();
  }

  const filesOn = rootFolder.getFilesByName('on.md');
  if (filesOn.hasNext()) {
    onMdContent = filesOn.next().getBlob().getDataAsString();
  }

  if (hearsContent) {
    const hearsLines = hearsContent.split('\n');
    const hearsMap = {};

    hearsLines.forEach((line) => {
      const [keyword, response] = line.split(':').map((s) => s.trim());
      if (keyword && response) {
        hearsMap[keyword.toLowerCase()] = response;
      }
    });

    const userMessage = message.text.toLowerCase();
    if (hearsMap[userMessage]) {
      sendMessage(chatId, hearsMap[userMessage], { parse_mode: 'Markdown' });
      return;
    }
  }

  if (onMdContent && message.chat.type === 'private') {
    sendMessage(chatId, onMdContent, { parse_mode: 'Markdown' });
  }
}

function parseInlineKeyboard(text) {
  const regex = /\[(.*?)\]\((callback|url):([^)]+)\)|---/g;
  let match;
  let keyboard = [];
  let row = [];

  while ((match = regex.exec(text)) !== null) {
    if (match[0] === '---') {
      if (row.length > 0) {
        keyboard.push(row);
        row = [];
      }
      continue;
    }

    const [, label, type, value] = match;

    if (type === 'callback') {
      row.push({ text: label, callback_data: value });
    } else if (type === 'url') {
      row.push({ text: label, url: value });
    }
  }

  if (row.length > 0) {
    keyboard.push(row);
  }

  return keyboard.length ? { inline_keyboard: keyboard } : null;
}

function sendMessage(chatId, text, options = {}) {
  if (!chatId || !text) return;

  const keyboard = parseInlineKeyboard(text);
  text = text.replace(/\[.*?\]\((callback|url):[^)]+\)|---/g, '');

  const payload = { chat_id: chatId, text, ...options };
  if (keyboard) payload.reply_markup = JSON.stringify(keyboard);

  UrlFetchApp.fetch(`${API_URL}/sendMessage`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}

function handleCallback(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  sendMessage(chatId, data);
}

function setWebhook() {
  const response = UrlFetchApp.fetch(`${API_URL}/setWebhook`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ url: WEBHOOK_URL }),
  });

  Logger.log(response.getContentText());
}
