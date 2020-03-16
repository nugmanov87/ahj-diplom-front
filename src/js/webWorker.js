import CryptoJS from 'crypto-js';

function enCrypt(objMsg, crypton) {
  const itemMsg = objMsg;
  const cryptMsg = CryptoJS.AES.encrypt(itemMsg.msg, crypton).toString();
  itemMsg.msg = cryptMsg;
  return itemMsg;
}

function deCrypt(objMsg, crypton) {
  try {
    const itemMsg = objMsg;
    const bytes = CryptoJS.AES.decrypt(itemMsg, crypton);
    const retStr = bytes.toString(CryptoJS.enc.Utf8);
    return retStr;
  } catch (e) {
    console.log(e);
    return null;
  }
}

self.addEventListener('message', async (e) => {  // eslint-disable-line
  let content = '';
  if (e.data.workCrypt === 'enCrypt') {
    content = await enCrypt(e.data.file, e.data.keyCrypt);
    self.postMessage(content); // eslint-disable-line
  } else if (e.data.workCrypt === 'deCrypt') {
    for (const item of e.data.file) {
      const inpMsg = JSON.parse(item);
      content = deCrypt(inpMsg.msg, e.data.keyCrypt);
      inpMsg.msg = content;
      self.postMessage(inpMsg); // eslint-disable-line
    }
    self.close(); // eslint-disable-line
  }
});
