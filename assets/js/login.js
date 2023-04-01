const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

class ValidateForm {
	constructor(form, fields) {
		this.form = form;
		this.fields = fields;
	}

	initializeForm() {
		this.validateOnInput();
		this.validateOnSubmit();
	}

	validateOnInput() {
		let selfForm = this;

		this.fields.forEach(field => {
			let input = document.querySelector(`#${field}`);
			input.addEventListener("input", () => {
				selfForm.validateFields(input);
			})
		});
	}

	validateFields(field) {
		let errorMessage = '';

		if (field.value.trim() === '') {
			errorMessage = 'This field is required';

		} else if (field.type === 'text' && field.value.length < 4) {
			errorMessage = 'Should be more than 4 letters';
		}

		if (field.type === 'email' && !this.isValidEmail(field.value)) {
			errorMessage = 'Please enter a valid email address';
		}

		if (field.id === 'reg-confirmPassword' && field.value !== document.querySelector('#reg-password').value) {
			errorMessage = 'Passwords do not match';
		}

		let errorSpan = field.nextElementSibling;
		errorSpan.innerText = errorMessage;
	}

	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	validateOnSubmit() {
		let selfForm = this;
		this.form.addEventListener("submit", (event) => {
			let isFormValid = true;
			event.preventDefault();

			selfForm.fields.forEach(field => {
				let input = document.querySelector(`#${field}`);
				selfForm.validateFields(input);

				if (input.nextElementSibling.innerText !== '') {
					isFormValid = false;
				}
			});

			if (isFormValid) {
				let formData = selfForm.getData();

				let savedData = JSON.parse(localStorage.getItem('Accounts')) || [];
				let existingNames = savedData.map(account => account['reg-name']);
				let existingEmails = savedData.map(account => account['reg-email']);
				if (existingNames.includes(formData['reg-name'])) {
					alert('An account with this name already exists!');
				} else if (existingEmails.includes(formData['reg-email'])) {
					alert('An account with this email already exists!');
				} else {
					savedData.push(formData);
					localStorage.setItem('Accounts', JSON.stringify(savedData));
					alert('Form submitted successfully!');
					selfForm.form.reset();
				}
			}
		});
	}

	getData() {
		let formData = {};
		this.fields.forEach(field => {
			formData[field] = document.querySelector(`#${field}`).value;
		});
		return formData;
	}
}

let form = document.querySelector("#registration-form");
let fields = ['reg-name', 'reg-email', 'reg-password', 'reg-confirmPassword'];
let newAccount = new ValidateForm(form, fields);

newAccount.initializeForm();
