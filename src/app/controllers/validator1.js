function Validator(options) {
    var formElement = document.querySelector(options.form);
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var ruleSelectors = {};

    function validate(inputElement, rule) {
        // var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorElement = getParent(
            inputElement,
            options.formGroup,
        ).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = ruleSelectors[rule.selector];

        // Lặp qua từng rule của selector, khi có errormessage thì thoát vòng lặp
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked'),
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }

            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroup).classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroup).classList.remove(
                'invalid',
            );
        }

        return !errorMessage;
    }

    if (formElement) {
        // Ngăn chặn hành vi mặc định của form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;
            // Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll(
                        '[name]:not([disabled])',
                    );
                    var formValues = Array.from(enableInputs).reduce(function (
                        values,
                        input,
                    ) {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector(
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
                        // return (values[input.name] = input.value) && values;
                    },
                    {});

                    options.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        };

        // Lặp qua từng rule và xử lý
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = getParent(
                inputElement,
                options.formGroup,
            ).querySelector(options.errorSelector);
            if (Array.isArray(ruleSelectors[rule.selector])) {
                ruleSelectors[rule.selector].push(rule.test);
            } else {
                ruleSelectors[rule.selector] = [rule.test];
            }
            if (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    //value: inputElement.value
                    //validate: rule.test()
                    validate(inputElement, rule);
                };

                // Xử lý khi người dùng nhập vào input
                inputElement.oninput = function () {
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerHTML = '';
                };
            }
        });
    }
}

// Define rules
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? '' : message || 'Vui lòng nhập trường này';
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            if (
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    value,
                )
            ) {
                return undefined;
            }
            return message || 'Vui lòng nhập đúng định dạng';
        },
    };
};

Validator.minLength = function (selector, minLength, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minLength
                ? undefined
                : message || `Vui lòng nhập tối thiểu ${minLength} kí tự`;
        },
    };
};

Validator.isConfirmed = function (selector, getValueBefore, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getValueBefore()
                ? undefined
                : message || 'Giá trị nhập vào không chính xác';
        },
    };
};
