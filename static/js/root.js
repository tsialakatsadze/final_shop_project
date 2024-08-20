const rootSelector = document.querySelector('#root');

function createElement(elementType, props, children) {
    const element = document.createElement(elementType)
    for (const prop in props) {
        if (prop === 'style') {
            Object.keys(props.style).forEach(function (styleName) {
                element.style[styleName] = props.style[styleName]
            })
        } else if (props[prop] !== null) {
            element[prop] = props[prop]
        }
    }
    if (children) {
        children.forEach(function (node) {
            element.appendChild(node)
        })
    }
    return element
}

const portalClicks = document.querySelectorAll('[data-portal]');
const portalCloseElements = document.querySelectorAll('[data-close-portal]');

const updateContentOverflow = (element, styles = {}) => {
    if (element instanceof HTMLElement && (element.dataset.freezeContent === undefined || element.dataset.freezeContent === 'true')) {
        for (const key in styles) document.querySelector('html').style[key] = styles[key];
    }
}

const openClosePortal = (event) => {
    const closeOpenPortals = new Promise((resolve, reject) => {
        const openPortals = document.querySelectorAll('[data-portal-open="true"]');
        openPortals.forEach(element => {
            element.dataset.portalOpen = 'false';
            element.classList.add('hidden');
            updateContentOverflow({
                overflow: '',
                paddingRight: ''
            });
        });
        resolve(document.querySelector(`#${event.currentTarget.getAttribute('data-portal')}`));
    })

    closeOpenPortals.then(element => {
        if (element instanceof HTMLElement && element.dataset.portalOpen === 'false') {
            element.classList.remove('hidden');
            element.dataset.portalOpen = 'true';

            updateContentOverflow(element, {
                overflow: 'hidden',
                paddingRight: !element.hasAttribute('data-disable-padding') ? '17px' : ''
            });
        } else {
            element.classList.add('hidden');
            element.dataset.portalOpen = 'false';
            updateContentOverflow({
                overflow: '',
                paddingRight: ''
            });
        }
    })
}

const closePortal = (event) => {
    const element = document.querySelector(`#${event.currentTarget.getAttribute('data-close-portal')}`);
    element.classList.add('hidden');
    updateContentOverflow({
        overflow: '',
        paddingRight: ''
    });
}

portalClicks.forEach(portalButton => portalButton.addEventListener('click', openClosePortal));
portalCloseElements.forEach(portalButton => portalButton.addEventListener('click', closePortal))

const dropdownButtons = document.querySelectorAll('[data-dropdown]');

const openDropdown = (event) => {
    const element = document.querySelector(`#${event.currentTarget.getAttribute('data-dropdown')}`);

    const handleOutsideClick = (event) => {
        if (!element.contains(event.target)) {
            if (element.classList.contains('hidden')) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
                return window.removeEventListener('click', handleOutsideClick, false);
            }
        }
    }

    if (element.classList.contains('hidden')) {
        return window.addEventListener('click', handleOutsideClick);
    }
}

dropdownButtons.forEach(portalButton => portalButton.addEventListener('click', openDropdown));

const statusCallback = async (response) => {
    if (response.status >= 200 && response.status < 300) {
        return await response.json();
    }
    throw await response.json();
};

const failureCallback = (form, response, currentTarget) => {
    if ('redirect_route' in response) {
        return window.location.href = response['redirect_route'];
    }
    if (typeof response === 'object' && 'errors' in response) {
        const {errors} = response;
        const validations = form.querySelectorAll('[data-validation-key]');
        for (const validation of validations) {
            const validationKey = validation.getAttribute('data-validation-key');

            if (errors.hasOwnProperty(validationKey)) {
                validation.innerText = errors[validationKey][0];
                validation.classList.remove('invisible');
            } else {
                validation.innerText = '';
                validation.classList.add('invisible');
            }
        }
    }
    if (currentTarget instanceof HTMLButtonElement) {
        currentTarget.removeAttribute('disabled');
        currentTarget.classList.remove('btn-disabled');
    }
};

const successCallback = (response, form) => {
    if ('message' in response) {
        form.parentNode.querySelector('#success_response').innerHTML = response.message;

        setTimeout(() => {
            if ('redirect_route' in response) {
                window.location.href = response['redirect_route'];
            }
        }, 1000)
    }
};

const getOptions = (form, formData) => {
    return {
        method: form.getAttribute('method'),
        headers: {
            'X-CSRFToken': form.querySelector('[name="csrfmiddlewaretoken"]').value,
            'Accept': 'application/json',
        },
        body: formData
    }
}

const getFormData = (form, fields = [], prefix = '#') => {
    const formData = new FormData();

    fields.map(field => formData.append(field, form.querySelector(prefix + field).value))

    return formData;
}

const loginFormSelector = document.querySelector('#login-form');

if (loginFormSelector instanceof HTMLFormElement) {
    loginFormSelector.addEventListener('submit', (event) => {
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const form = currentTarget.closest('form');

        fetch(form.getAttribute('action'), getOptions(form, getFormData(form, ['username', 'password'], '#login_')))
            .then(statusCallback)
            .then(response => successCallback(response, form))
            .catch((response) => failureCallback(form, response, currentTarget));
    })
}

const registerFormSelector = document.querySelector('#register-form');

if (registerFormSelector instanceof HTMLFormElement) {
    registerFormSelector.addEventListener('submit', (event) => {
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const form = currentTarget.closest('form');

        fetch(form.getAttribute('action'), getOptions(form, getFormData(form, ['username', 'email', 'password1', 'password2'], '#register_')))
            .then(statusCallback)
            .then(response => successCallback(response, form))
            .catch((response) => failureCallback(form, response, currentTarget));
    })
}


const passwordElements = document.querySelectorAll('[data-password-eye]');

passwordElements.forEach(passwordElement => {
    const passwordEye = document.querySelector(passwordElement.getAttribute('data-password-eye'));

    if (passwordEye instanceof HTMLElement) {
        passwordEye.addEventListener('click', function () {
            const type = passwordElement.getAttribute('type');
            const iconEye = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
            const iconEyeSlash = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`;

            switch (type) {
                case 'password':
                    passwordEye.innerHTML = iconEye;
                    passwordElement.setAttribute('type', 'text');
                    break;
                default:
                    passwordEye.innerHTML = iconEyeSlash;
                    passwordElement.setAttribute('type', 'password');
            }
        });
    }
})

const checkoutRadioElements = document.querySelectorAll('[data-radio-checked]');
const activeCheckoutRadioClasses = `relative p-4 rounded border cursor-pointer group hover:border-accent border-accent shadow-sm select-none`;
const inActiveCheckoutRadioClasses = `relative p-4 rounded border cursor-pointer group hover:border-accent bg-gray-100 border-transparent select-none`;

const updateCheckoutRadioElements = (event) => {
    event.preventDefault();

    const radioElement = event.currentTarget;
    const activeRadioElement = document.querySelector('[data-radio-checked="true"]');

    if (radioElement === activeRadioElement) return;

    cleanCheckoutRadioElement(checkoutRadioElements).then(result => {
        if (result) {
            if (radioElement.dataset.radioChecked === 'false') {
                document.querySelector('#delivery_schedule').value = radioElement.dataset.radioValue;
            }

            radioElement.children[0].className = radioElement.dataset.radioChecked === 'false' ? activeCheckoutRadioClasses : inActiveCheckoutRadioClasses;
            radioElement.dataset.radioChecked = (radioElement.dataset.radioChecked === 'false').toString();
        }
    })
}

const cleanCheckoutRadioElement = (elements) => {
    return new Promise(resolve => {
        elements.forEach(element => {
            element.children[0].className = inActiveCheckoutRadioClasses;
            element.dataset.radioChecked = 'false';
        });
        resolve(true);
    });
}

if (checkoutRadioElements instanceof NodeList) {
    checkoutRadioElements.forEach(radioElement => radioElement.addEventListener('click', updateCheckoutRadioElements));
}

const checkoutButton = document.querySelector('#checkout_button');

if (checkoutButton instanceof HTMLElement) {
    document.querySelector('#checkout_button').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('#checkout_form').submit();
    });
}

