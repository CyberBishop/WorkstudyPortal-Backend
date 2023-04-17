function getCookie({ name, headers }) {
	let value = "; " + headers;
	let parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	}
}

module.exports = getCookie;
