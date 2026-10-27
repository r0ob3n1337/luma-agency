const form = document.querySelector('.form');
const submitButton = form.querySelector('[type="submit"]');
const agreeCheckbox = form.querySelector('[name="agree"]');
const phoneInput = form.querySelector('[name="phone"]');
const popup = document.querySelector('.popup');

const PHONE_LENGTH = '+7 (999) 111-22-33'.length;

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

function validateForm() {
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

  if (!validateForm()) {
    return;
  }

  form.reset();
  updateSubmitButton();
  popup.showModal();
});

popup.addEventListener('click', (event) => {
  if (event.target === popup || event.target.closest('.popup__close')) {
    popup.close();
  }
});

updateSubmitButton();
