/* eslint-disable no-unused-vars */
import callPopup from './callPopup.js';
import {
  popupOk,
  popupCancel,
  okPopup,
  cancelPopup,
  popupShow,
} from './configGeolocation.js';

export default function getGEO(popup) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        },
        (error) => {
          const msg = 'К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную. Введите Широту и долготу через запятую (45.0000, 54.0000)';
          callPopup(msg, popup);
          popupOk.addEventListener('click', okPopup);
          popupCancel.addEventListener('click', cancelPopup);
        },
      );
    } else {
      const msg = 'Не поддерживает браузер. Введите широту и долготу через запятую';
      callPopup(msg, popup);

      popupOk.addEventListener('click', popupShow);
      popupCancel.addEventListener('click', cancelPopup);
    }
  });
}

function validateGEO(coord) {
  if (
    coord.search(
      /^(\[?-?)((\d|[0-8]\d?|90)\.\d{4,}), ?(-|−)?((\d|\d\d|1[0-7][0-9]|180)\.\d{4,})(\]?)$/,
    ) !== -1
  ) {
    return true;
  }
  return false;
}

export { validateGEO };
