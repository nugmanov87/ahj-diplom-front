/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
export const popupOk = document.querySelector('.popup-ok');
export const popupCancel = document.querySelector('.popup-cancel');

export function okPopup() {
  popup.showPopup('GEO ok', error);
  if (popup.validate()) {
    resolve(popupInp.value);
  }
}

export function cancelPopup() {
  reject('cancel');
}

export function popupShow() {
  popup.showPopup('GEO ok');
  if (popup.validate()) {
    resolve(popupInp.value);
  }
}
