function Validator(formSelector) {
    var _this = this;
    console.log(_this);
    var elementForm = document.querySelector(formSelector);
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    /**
     * Quy luật tạo rules:
     * Nếu có lỗi trả về error message
     * Nếu không có lỗi trả về undefined
     */
    var validateRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value)
                ? undefined
                : 'Vui lòng nhập đúng định dạng';
        },
        min: function (minLength, message) {
            return function (value) {
                return value.length >= minLength
                    ? undefined
                    : message || `Vui lòng nhập tối thiểu ${minLength} kí tự`;
            };
        },
        confirmed: function (value, valueBefore) {
            return value === valueBefore
                ? undefined
                : 'Mật khẩu nhập không chính xác';
        },
    };

    if (elementForm) {
        var inputs = elementForm.querySelectorAll('input[name][rules]');
        var formRules = {};
        Array.from(inputs).forEach((input) => {
            var rules = input.getAttribute('rules').split('|');

            for (var rule of rules) {
                var ruleFunc = validateRules[rule];
                if (rule.includes(':')) {
                    var ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    ruleFunc = validateRules[ruleInfo[0]](ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // Lắng nghe sự kiện để validate: blur, change, ...

            input.onblur = handleValidateBlur;
            input.oninput = handleValidateInput;
        });

        function handleValidateBlur(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (event.target.name === 'password-confirmed') {
                    errorMessage = rule(
                        event.target.value,
                        elementForm.querySelector('#password').value,
                    );
                }
                if (errorMessage) break;
            }

            // Nếu có lỗi thì hiển thị
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');

                if (formGroup) {
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formGroup.classList.add('invalid');
                        formMessage.innerHTML = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        // Hàm clear message error
        function handleValidateInput(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup) {
                var formMessage = formGroup.querySelector('.form-message');
                formGroup.classList.remove('invalid');
                formMessage.innerHTML = '';
            }
        }
    }

    // Xử lý hành vi submit form
    elementForm.onsubmit = function (event) {
        event.preventDefault();

        var inputs = elementForm.querySelectorAll('input[name][rules]');
        var isValid = true;
        Array.from(inputs).forEach((input) => {
            if (!handleValidateBlur({ target: input })) {
                isValid = false;
            }
        });

        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = elementForm.querySelectorAll(
                    '[name]:not([disabled])',
                );
                var formValues = Array.from(enableInputs).reduce(function (
                    values,
                    input,
                ) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = elementForm.querySelector(
                                'input[name="' + input.name + '"]',
                            ).value;
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                return values;
                            }

                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }

                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }

                    return values;
                },
                {});
                _this.onSubmit(formValues);
            } else {
                elementForm.submit();
            }
        }
    };
}
