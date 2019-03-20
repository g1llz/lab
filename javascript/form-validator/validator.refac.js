const validator = () => {

	return {
		form: (forms) => {

			forms.forEach(form => {
				const fields = form.querySelectorAll('[data-validate]');

				Array.prototype.filter.call(fields, function (field) {
					
					templateRender(field);

					const events = field.dataset.events ?
						(field.dataset.events).split(',') : ['focusout'];

					events.forEach(event => {
						field.addEventListener(event.trim(), function () {
							const type = field.getAttribute('type');

							isValid(this, form, () => typeCheck[type](this.value));  
							toggleButton(form);
						
						});
					});
				});
				/* set button disabled (first check) */
				toggleButton(form);
			})
		}
	}
}
// export default validator;

/*
to display error text you must have a <div> below the input field;
-- <div class="invalid-feedback"></div>;
*/
const error = (element) => {
	return {
		add: () => element.classList.add('field-error'),
		rmv: () => element.classList.remove('field-error'),
		show: () => element.nextElementSibling.style.opacity = '1',
		hide: () => element.nextElementSibling.style.opacity = '0',
		text: text => element.nextElementSibling.textContent = text
	}
}

const needValidate = (element) => {
	return {
		add: () => element.classList.add('need-validate'),
		rmv: () => element.classList.remove('need-validate')
	}
}

const isValid = (context, form, fn) => {
	const required = context.hasAttribute('required');

	required &&
	!context.value ? needValidate(context).add() : null;
	
	let result = fn();
	console.log(required);
	if (!context.value || !result) {
		error(context).add();
		!context.value ?
			error(context).text(context.dataset.messageDefault || 'Required.') :
			error(context).text(context.dataset.messageInvalid || 'Invalid.');
		error(context).show();
		toggleButton(form);
		return;
	}
	error(context).rmv();
	error(context).hide();

	needValidate(context).rmv();
	return;	
}

const toggleButton = (form) => {
	/* enable or disable button after validation */
	const submit = form.querySelector('button[type="submit"]');
	const errors = form.querySelectorAll('.field-error');
	const nvalid = form.querySelectorAll('.need-validate');

	submit.disabled = errors.length > 0 || nvalid.length > 0 ? true : false;
}

const typeCheck = {
	email: (string) => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return regex.test(String(string).toLowerCase());
	},
	url: (string) => {
		try {
			new URL(string); return true;
		} catch (_) {
			return false;
		}
	},
	number: (number) => {
		if (isNaN(number)) return false;
		return true; 
	},
	text: (string) => {
		if (!string.trim()) return false;
		return true; 
	},
	phone: (phone) => {
		let number = /^\d+$/;
		if (!number.test(String(phone).toLowerCase())) return false;
		if (!(phone.length >= 8 && phone.length <= 9)) return false;
		if (phone.length == 9 && parseInt(phone.substring(0, 1)) != 9) return false;

		for (var n = 0; n < 10; n++) {
			if (phone == new Array(9).join(n) || phone == new Array(10).join(n)) return false;
		}

		if (phone.length == 8 && [2, 3, 4, 5, 7].indexOf(parseInt(phone.substring(0, 1))) == -1) return false;
		return true;
	}
}

const templateRender = (element) => {
	const template = document.createElement('div');
	template.classList.add('invalid-feedback');

	element.after(template);
}
