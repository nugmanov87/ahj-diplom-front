/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
import TransferMessage from './TransferMessage.js';
import PopupShow from './PopupShow.js';
import RecAudioVideo from './RecAudioVideo.js';
import getGEO from './getGeolocation.js';
import BotChat from './BotChat.js';

const uuid = require('uuid');

const popup = new PopupShow();
popup.init();

let transferMsg = {};
const elWindowStart = document.querySelector('.window');
const elLegends = document.querySelector('.legends');
const funcBot = new BotChat(document.querySelector('.display-legends'));

const submitName = document.querySelector('#submit-name');
submitName.addEventListener('click', recAudioVideo);

const buttonSelectFile = document.querySelector('#button-select');
buttonSelectFile.addEventListener('change', changeEvent);

const elAddFile = document.querySelector('.add-file');
elAddFile.addEventListener('click', addFile);

const elSelectFile = document.querySelector('#drop-file');
elSelectFile.addEventListener('dragover', (event) => {
  event.preventDefault();
});
elSelectFile.addEventListener('drop', dragFile);
elSelectFile.addEventListener('scroll', scrollingMessage);
elSelectFile.addEventListener('click', addLike);

const elFavorits = document.querySelector('#favorits');
elFavorits.addEventListener('click', showFavorits);

const elInput = document.querySelector('#el-input');
elInput.addEventListener('keypress', sendText);

const elPopupInput = document.querySelector('.popup-inp');
const elPopup = document.querySelector('.popup');

const elPopupCancel = document.querySelector('.popup-cancel');
elPopupCancel.addEventListener('click', popupCancel);

const elPopupOk = document.querySelector('.popup-ok');
elPopupOk.addEventListener('click', popupOk);

const elGEO = document.querySelector('.geo-teg');
elGEO.addEventListener('click', geoLocation);

const elExport = document.querySelector('#export-history');
elExport.addEventListener('click', transferHistory);

async function recAudioVideo() {
  const inputName = document.querySelector('#inp-name');
  const keyCrypt = inputName.value;

  transferMsg = new TransferMessage(keyCrypt);
  transferMsg.init();

  inputName.value = '';
  elLegends.classList.remove('hidden');
  elWindowStart.classList.add('hidden');
  const recorder = new RecAudioVideo(popup, transferMsg);
  recorder.init();
}

function loadFile(file) {
  const itemId = uuid.v4();
  const regExp = /[a-z]+/;
  const typeFile = file.type.match(regExp)[0];

  const fr = new FileReader();
  fr.readAsDataURL(file);

  fr.onload = () => {
    const objMessage = {
      id: itemId,
      type: typeFile,
      pin: false,
      favorit: false,
      name: file.name,
      msg: fr.result,
      dateTime: new Date(),
    };
    transferMsg.sendMessage(objMessage);
  };
}

function addFile() {
  buttonSelectFile.value = null;
  buttonSelectFile.dispatchEvent(new MouseEvent('click'));
}

function dragFile(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  for (const item of files) {
    loadFile(item);
  }
}

function changeEvent(event) {
  const files = Array.from(event.currentTarget.files);
  loadFile(files[0]);
}

function scrollingMessage(event) {
  if (event.target.scrollTop === 0) {
    transferMsg.lazyLoad();
  }
}

function addLike(event) {
  const itemEl = event.target;
  if (itemEl.classList.contains('like')) {
    const parentEl = itemEl.closest('.item-message');
    if (itemEl.classList.contains('favorit')) {
      itemEl.classList.remove('favorit');
      parentEl.classList.add('no-favorit');
      transferMsg.changeFavorit(parentEl.dataset.id, false);
      return;
    }
    itemEl.classList.add('favorit');
    parentEl.classList.remove('no-favorit');
    transferMsg.changeFavorit(parentEl.dataset.id, true);
  }
}

function showFavorits() {
  if (elFavorits.classList.contains('favorit')) {
    elFavorits.classList.remove('favorit');
    elFavorits.innerHTML = '';
    return;
  }
  elFavorits.classList.add('favorit');
  elFavorits.innerHTML = '<style>.no-favorit, .inputs {display: none;}</style>';
}

function sendText(evt) {
  if ((evt.keyCode === 13 || evt.keyCode === 10) && evt.ctrlKey === true) {
    evt.preventDefault();

    const regExpBot = /^terminator: /;
    if (elInput.value.search(regExpBot) !== -1) {
      funcBot.funcBot(elInput.value);
      elInput.value = '';
      return;
    }

    const objMessage = {
      id: uuid.v4(),
      type: 'textMsg',
      pin: false,
      favorit: false,
      msg: elInput.value,
      dateTime: new Date(),
    };
    transferMsg.sendMessage(objMessage);
    elInput.value = '';
  }
}

function popupCancel() {
  elPopup.classList.add('hidden');
  return false;
}

function popupOk() {
  if (elPopupInput.classList.contains('hidden')) {
    elPopup.classList.add('hidden');
  }
}

async function geoLocation() {
  const GEOteg = await getGEO(popup);
  elPopup.classList.add('hidden');
  const objMessage = {
    id: uuid.v4(),
    type: 'textMsg',
    pin: false,
    favorit: false,
    msg: GEOteg,
    dateTime: new Date(),
  };
  transferMsg.sendMessage(objMessage);
}

async function transferHistory() {
  transferMsg.exportHistory();
}
