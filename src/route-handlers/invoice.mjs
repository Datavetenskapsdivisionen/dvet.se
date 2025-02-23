import fs from 'fs';
import path from 'path';
import process from "process";
import { exec } from "child_process";
import { decodeJwt } from 'jose';

const readInvoiceData = () => {
    try {
        const file = fs.readFileSync("./invoice-data.json");
        return file && file.length > 0 ? JSON.parse(file) : { };
    } catch {
        return { };
    }
};

const writeInvoiceData = (res, data) => {
    fs.writeFile("./invoice-data.json", JSON.stringify(data), error => {
        if (error) { return res.status(400).json({error: error}); }
    });
};

const getInvoiceData = async (req, res) => {
    const invoiceData = readInvoiceData();
    return res.status(200).json(invoiceData);
};

const sendPDF = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) { return res.status(404).send('File not found'); }

        const base64Data = data.toString('base64');
        res.json({ base64: base64Data });
    });
};

const getInvoice = async (req, res) => {
    const invoice = req.params.invoice;

    const dir = "/src/latex/invoice/pdf";
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }

    const filePath = path.join(`${dir}/`, `${invoice}.pdf`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) { return res.status(404).send('Invoice not found'); }
        return sendPDF(filePath, res);
    });
};

const createInvoice = async (req, res) => {
    let invoice = req.body;
    const user = decodeJwt(req.headers.authorization.split(" ")[1]);
    const invoiceData = readInvoiceData();
    if (!invoiceData.invoices) { invoiceData.invoices = []; }
    const invoiceNumber = Math.max(...invoiceData.invoices.map(inv => inv.invoiceNumber), 0) + 1;
    
    invoice = {
        ...invoice,
        treasurer: user.name,
        invoiceNumber: invoiceNumber,
        ocr: createOCR(invoiceNumber)
    }

    const sanitisedInvoice = Object.keys(invoice).reduce((acc, key) => {
        if (typeof invoice[key] === 'string') {
            acc[key] = invoice[key].replace(/[\{\}\$]/g, '');
        } else if (Array.isArray(invoice[key])) {
            acc[key] = invoice[key].map(item => {
                const formattedItem = `${item.name} & ${item.price} & ${item.quantity} & ${item.total} \\\\`;
                return formattedItem.replace(/[\{\}\$]/g, '');
            }).join('\n');
        } else {
            acc[key] = invoice[key];
        }
        return acc;
    }, {});

    const dir = path.join(process.cwd(), "/src/latex/invoice");
    const texSrcPath = path.join(`${dir}/`, "invoice-template.tex");

    const texSrc = fs.readFileSync(texSrcPath, "utf8");
    const updatedTex = texSrc
        .replace('{LOGO_PLACEHOLDER}', process.cwd() + sanitisedInvoice.logo)
        .replace('{CUSTOMER_PLACEHOLDER}', sanitisedInvoice.customer)
        .replace('{INVOICE_NUMBER_PLACEHOLDER}', sanitisedInvoice.invoiceNumber)
        .replace('{TREASURER_PLACEHOLDER}', sanitisedInvoice.treasurer)
        .replace('{INVOICEE_REFERENCE_PLACEHOLDER}', sanitisedInvoice.invoiceeReference)
        .replace('{KST_PLACEHOLDER}', sanitisedInvoice.kst)
        .replace('{ORG_NUMBER_PLACEHOLDER}', sanitisedInvoice.orgNumber)
        .replace('{CUSTOMER_NAME_PLACEHOLDER}', sanitisedInvoice.customerName)
        .replace('{CUSTOMER_ADDRESS_1_PLACEHOLDER}', sanitisedInvoice.customerAddress1)
        .replace('{CUSTOMER_ADDRESS_2_PLACEHOLDER}', sanitisedInvoice.customerAddress2)
        .replace('{CUSTOMER_ADDRESS_3_PLACEHOLDER}', sanitisedInvoice.customerAddress3)
        .replace('{{ITEMS_PLACEHOLDER}}', sanitisedInvoice.items)
        .replace('{TOTAL_COST_PLACEHOLDER}', sanitisedInvoice.totalCost)
        .replace('{OCR_PLACEHOLDER}', sanitisedInvoice.ocr);

    fs.writeFileSync(`${dir}/invoice-temp.tex`, updatedTex, "utf8");
    
    const jobname = req.params.temp ? "invoice-temp" : sanitisedInvoice.ocr;
    console.log(jobname);

    const command = `pdflatex -jobname=${jobname} -output-directory=${dir} -halt-on-error ${dir}/invoice-temp.tex | grep '^!.*' -A200 --color=always`;
    const child = exec(command);
    child.stdout.pipe(process.stdout);
    child.on("exit", () => {
        fs.rename(`${dir}/${jobname}.pdf`, `${dir}/pdf/${jobname}.pdf`, (err) => {
            if (err) throw err;
            
            if (!req.params.temp) { // Keep preview files for compilation performance
                fs.unlink(`${dir}/${jobname}.aux`, (err) => { if (err) throw err; });
                fs.unlink(`${dir}/${jobname}.log`, (err) => { if (err) throw err; });
                fs.unlink(`${dir}/${jobname}.out`, (err) => { if (err) throw err; });
            }
            fs.unlink(`${dir}/invoice-temp.tex`, (err) => {
                if (err) throw err;

                if (!req.params.temp) {
                    invoiceData.invoices.push(sanitisedInvoice);
                    writeInvoiceData(res, invoiceData);
                }

                sendPDF(`${dir}/pdf/${jobname}.pdf`, res);
            });
        });
    });
};

const createTempInvoice = async (req, res) => {
    req.params.temp = true;
    createInvoice(req, res);
};

const addCustomer = async (req, res) => {
    const data = req.body;
    if (!data.customerName) { return res.status(500).send("Invalid data"); }

    const invoiceData = readInvoiceData();
    if (!invoiceData.customers) { invoiceData.customers = []; }

    const existingCustomer = invoiceData.customers.find(customer =>
        customer.customerName === data.customerName &&
        customer.orgNumber === data.orgNumber &&
        customer.customerAddress1 === data.customerAddress1 &&
        customer.customerAddress2 === data.customerAddress2 &&
        customer.customerAddress3 === data.customerAddress3 &&
        customer.invoiceeReference === data.invoiceeReference &&
        customer.kst === data.kst
    );

    if (existingCustomer) {
        return res.status(400).json({ error: "Customer already exists" });
    }

    const latestCustomer = Math.max(...invoiceData.customers.map(c => c.customer), 0);
    const newCustomer = {
        customer: latestCustomer + 1,
        customerName: data.customerName,
        orgNumber: data.orgNumber,
        customerAddress1: data.customerAddress1,
        customerAddress2: data.customerAddress2,
        customerAddress3: data.customerAddress3,
        invoiceeReference: data.invoiceeReference,
        kst: data.kst
    }
    invoiceData.customers.push(newCustomer);

    writeInvoiceData(res, invoiceData);

    return res.status(200).json(invoiceData.customers[invoiceData.customers.length - 1]);
};

const deleteCustomer = async (req, res) => {
    const data = req.params;
    if (!data.customer) { return res.status(500).send("Invalid data"); }
    const customer = parseInt(data.customer);
    
    const invoiceData = readInvoiceData();
    if (!invoiceData.customers.find(c => c.customer === customer)) {
        return res.status(404).send("Customer not found");
    }

    invoiceData.customers = invoiceData.customers.filter(c => c.customer !== customer);
    writeInvoiceData(res, invoiceData);

    return res.status(200).json(invoiceData.customers);
};


function calculateLuhnCheckDigit(number) {
    const digits = number.toString().split('').map(Number);
    let sum = 0;
    let shouldDouble = false;
  
    // Process digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
  
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
  
        sum += digit;
        shouldDouble = !shouldDouble;
    }
  
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
}

function createOCR(invoiceNumber) {
    const controlNumber = calculateLuhnCheckDigit(invoiceNumber);
    const length = invoiceNumber.toString().length + 1;
    const ocr = `${invoiceNumber}${length}${controlNumber}`;
    return parseInt(`${invoiceNumber}${ocr.length}${controlNumber}`);
}

function validateOCR(number) {
    const strNumber = number.toString();
    const length = strNumber.length;
    const lengthNumOfDigits = length.toString().length;
    const expectedLength = parseInt(strNumber.slice(length - lengthNumOfDigits - 1, length - 1));
    const actualNumber = parseInt(strNumber.slice(0, length - lengthNumOfDigits - 1));
    const controlNumber = parseInt(strNumber[length - 1]);
    
    if (length !== expectedLength) {
        return false;
    }

    return calculateLuhnCheckDigit(actualNumber) === controlNumber;
}

export { getInvoiceData, getInvoice, createInvoice, createTempInvoice, addCustomer, deleteCustomer };