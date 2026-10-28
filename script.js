const PHONE_LENGTH = '+7 (999) 111-22-33'.length;

const closeButtonTemplate = `
  <button class="popup__close" type="button" aria-label="Закрыть">
    <img src="images/icon-close.svg" width="24" height="24" alt="">
  </button>
`;

const formFieldsTemplate = `
  <div class="form__row">
    <label class="field">
      Имя*
      <input class="field__input" type="text" name="name" placeholder="Ваше имя" required>
    </label>
    <label class="field">
      Email*
      <input class="field__input" type="email" name="email" placeholder="your@email.com" required>
    </label>
  </div>
  <div class="form__row">
    <label class="field">
      Телефон*
      <input class="field__input" type="tel" name="phone" placeholder="+7 (___) ___-__-__" required>
    </label>
    <label class="field">
      Тип проекта*
      <select class="field__input field__input--select" name="type" required>
        <option value="" selected disabled>Выберите тип съемки</option>
        <option>Коммерческая съемка</option>
        <option>Портретная съемка</option>
        <option>Предметная съемка</option>
        <option>Fashion и редакционная съемка</option>
        <option>Продакшн</option>
      </select>
    </label>
  </div>
  <label class="field">
    Бюджет*
    <select class="field__input field__input--select" name="budget" required>
      <option value="" selected disabled>Выберите диапазон</option>
      <option>До 50 000 ₽</option>
      <option>50 000 – 150 000 ₽</option>
      <option>150 000 – 300 000 ₽</option>
      <option>Более 300 000 ₽</option>
    </select>
  </label>
  <label class="field">
    Описание проекта*
    <textarea class="field__input field__input--textarea" name="message" placeholder="Расскажите о задаче, сроках и референсах" required></textarea>
  </label>
  <label class="checkbox">
    <input type="checkbox" name="agree" required>
    <span>Я согласен на <a class="underline" href="#">обработку персональных данных</a>*</span>
  </label>
  <button class="button button--full" type="submit" disabled>Отправить <span>→</span></button>
`;

// поля формы подставляет initForm из formFieldsTemplate
const formPopupTemplate = `
  <dialog class="popup popup--form" aria-labelledby="form-popup-title">
    <div class="popup__head">
      <h2 class="popup__title title-s" id="form-popup-title">Обсудить проект</h2>
      ${closeButtonTemplate}
    </div>
    <form class="form" action="#" method="post" novalidate>
      <p class="lead">Поля со звездочкой обязательны для заполнения</p>
    </form>
  </dialog>
`;

const successPopupTemplate = `
  <dialog class="popup" aria-labelledby="success-popup-title">
    <div class="popup__head">
      <h2 class="popup__title title-s" id="success-popup-title">Заявка отправлена</h2>
      ${closeButtonTemplate}
    </div>
    <p>Спасибо за обращение. Мы свяжемся с вами, чтобы обсудить детали съемки.</p>
  </dialog>
`;

function formatPhone(value) {
  let digits = value.replace(/\D/g, '');

  if (digits[0] === '7' || digits[0] === '8') {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (!digits) {
    return '';
  }

  let result = '+7 (' + digits.slice(0, 3);

  if (digits.length > 3) {
    result += ') ' + digits.slice(3, 6);
  }
  if (digits.length > 6) {
    result += '-' + digits.slice(6, 8);
  }
  if (digits.length > 8) {
    result += '-' + digits.slice(8, 10);
  }

  return result;
}

function getError(input) {
  const value = input.value.trim();

  if (!value) {
    return 'Заполните поле';
  }
  if (input.name === 'name' && /\d/.test(value)) {
    return 'Имя не должно содержать цифры';
  }
  if (input.name === 'phone' && value.length !== PHONE_LENGTH) {
    return 'Введите номер полностью';
  }

  return '';
}

function showError(input, message) {
  const field = input.closest('.field');
  let error = field.querySelector('.field__error');

  if (!error) {
    error = document.createElement('span');
    error.className = 'field__error';
    field.append(error);
  }

  error.textContent = message;
  field.classList.toggle('field--error', Boolean(message));
}

function validateForm(form) {
  let isValid = true;

  form.querySelectorAll('.field__input').forEach((input) => {
    const message = getError(input);
    showError(input, message);

    if (message) {
      isValid = false;
    }
  });

  return isValid;
}

function initForm(form, onSuccess) {
  form.insertAdjacentHTML('beforeend', formFieldsTemplate);

  const submitButton = form.querySelector('[type="submit"]');
  const agreeCheckbox = form.querySelector('[name="agree"]');
  const phoneInput = form.querySelector('[name="phone"]');

  function updateSubmitButton() {
    submitButton.disabled = !agreeCheckbox.checked;
  }

  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  form.addEventListener('input', (event) => {
    if (event.target.classList.contains('field__input')) {
      showError(event.target, '');
    }
  });

  agreeCheckbox.addEventListener('change', updateSubmitButton);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    form.reset();
    updateSubmitButton();
    onSuccess();
  });

  updateSubmitButton();
}

function createPopup(template) {
  document.body.insertAdjacentHTML('beforeend', template);
  const popup = document.body.lastElementChild;

  popup.addEventListener('click', (event) => {
    if (event.target === popup || event.target.closest('.popup__close')) {
      popup.close();
    }
  });

  return popup;
}

const successPopup = createPopup(successPopupTemplate);
const formPopup = createPopup(formPopupTemplate);
const pageForm = document.querySelector('main .form');
const openFormButtons = document.querySelectorAll('[data-open-form]');

if (pageForm) {
  initForm(pageForm, () => successPopup.showModal());
}

initForm(formPopup.querySelector('.form'), () => {
  formPopup.close();
  successPopup.showModal();
});

openFormButtons.forEach((button) => {
  button.addEventListener('click', () => formPopup.showModal());
});
