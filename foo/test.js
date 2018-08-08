// Requires
const {wrap} = require('co');
const {join} = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const thunkify = require('thunkify');
const read = thunkify(require('fs').readFile);
const handlebars = require('handlebars');
var path = "./certificateddocs/";

// PDF Options
const pdf_options = {format: 'A4', quality: 150, orientation: "landscape",  zoomFactor: "0.5"};

// GeneratePDF
const generatePDF = wrap(function * () {
	// Data we're going to pass to Handlebars
	const data = {
		// mycompany: {
		// 	name: 'GeeX',
		// 	address: 'Street 1',
		// 	city: 'Amsterdam',
		// 	zipcode: '1000 AA'
		// },
		// customer: {},
		// invoice_no: generateInvoiceNo(),
		// date_created: moment().format('DD/MM/YYYY'),
		// date_due: moment().add(14, 'days').format('DD/MM/YYYY')
		student: {
			name: 'Mahesh',
			course: 'Mean Stack',
			date: '22nd June',
			year: '2016'
		},
		employee: {
			name: 'Hari Prasad',
			designation: 'Block Chain Digital Lync'
		}
	};

	// Add customer data
	// data.customer = {
	// 	org: 'Your Org',
	// 	name: 'Foo Bar',
	// 	email: 'mail@domain.com'
	// };

	// Read source template
	const source = yield read(join(`${__dirname}/template1.html`), 'utf-8');

	// Convert to Handlebars template and add the data
	const template = handlebars.compile(source);
	const html = template(data);

	// Generate PDF and thunkify the toFile function
	const p = pdf.create(html, pdf_options);
	p.toFile = thunkify(p.toFile);

	// Saves the file to the File System as invoice.pdf in the current directory
	yield p.toFile(`${join(__dirname, './certificateddocs/document.pdf')}`);

});


function generateInvoiceNo() {
	return moment().format('YYYYMMDD');
}


generatePDF();



