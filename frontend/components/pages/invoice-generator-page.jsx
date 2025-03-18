import React from "react";
import Cookies from "js-cookie";
import DraggableTable from "components/widgets/draggable-table";
import { decodeJwt } from "jose";

const getInvoiceData = async () => {
    const token = Cookies.get("dv-token");
    const response = await fetch("/api/styrelsen/invoice-data", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
}

const me = () => {
    const [authorised, setAuthorised] = React.useState({ok: false, msg: "Access denied."});
    const [customers, setCustomers] = React.useState([]);
    const [selectedCustomer, setSelectedCustomer] = React.useState("");
    const [invoicePreview, setInvoicePreview] = React.useState(<></>);
    const [invoiceForm, setInvoiceForm] = React.useState(defaultInvoiceFormState);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [focusedInput, setFocusedInput] = React.useState(null);

    const user = React.useRef(null);

    React.useEffect(() => {
        const token = Cookies.get("dv-token");
        if (token) {
            fetch("/api/verify-token", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).then(res => {
                if (res.ok) {
                    user.current = decodeJwt(token);
                } else {
                    Cookies.remove("dv-token");
                    window.location.reload();
                }
            });

            fetch("/api/styrelsen/invoice-data", { headers: { Authorization: `Bearer ${token}` } }).then(res => {
                if (res.ok) {
                    setAuthorised({ok: true, msg: ""});
                } else {
                    res.json().then(data => {
                        setAuthorised({ok: false, msg: data.msg});
                    });
                }
            });
        }

        getInvoiceData().then(data => {
            setCustomers(data?.customers ?? []);
        });
    }, []);

    const requestPreview = (data) => {
        createInvoice(data, true);
    }

    const createInvoice = (data, isPreview = false) => {
        setIsDisabled(true);
        fetch(isPreview ? "/api/styrelsen/invoice/createPreview" : "/api/styrelsen/invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("dv-token")}`
            },
            body: JSON.stringify(data)
        }).then(data => {
            if (!data.ok) { return; }

            data.json().then(({ base64 }) => {
                setInvoicePreview(<embed src={`data:application/pdf;base64,${base64}`} width="100%" height="600px" />);
            });
        }).finally(() => setIsDisabled(false));
    };

    const handleCustomerChange = (event) => {
        const c = customers.find(c => c.customer == event.target.value);
        if (!c) {
            setInvoicePreview(<></>);
            setInvoiceForm(defaultInvoiceFormState);
            setSelectedCustomer("");
            return;
        }

        setSelectedCustomer(c.customer);
        setInvoiceForm(oldInvoiceForm => {
            const newInvoiceForm = {
                ...oldInvoiceForm,
                customer: c.customer,
                invoiceeReference: c.invoiceeReference,
                kst: c.kst,
                orgNumber: c.orgNumber,
                customerName: c.customerName,
                customerAddress1: c.customerAddress1,
                customerAddress2: c.customerAddress2,
                customerAddress3: c.customerAddress3
            };

            requestPreview(newInvoiceForm);
            
            return newInvoiceForm;
        });
    };

    const handleInputChange = (event, form, setForm) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const onSaveCustomer = (event) => {
        event.preventDefault();

        if (!validateRequiredFields({ saveCustomer: true })) {
            return;
        }

        const existingCustomer = customers.find(customer =>
            customer.customerName === invoiceForm.customerName &&
            customer.orgNumber === invoiceForm.orgNumber &&
            customer.customerAddress1 === invoiceForm.customerAddress1 &&
            customer.customerAddress2 === invoiceForm.customerAddress2 &&
            customer.customerAddress3 === invoiceForm.customerAddress3 &&
            customer.invoiceeReference === invoiceForm.invoiceeReference &&
            customer.kst === invoiceForm.kst
        );

        if (existingCustomer) {
            return window.alert(`Customer ${existingCustomer.customer}: ${existingCustomer.customerName} (${existingCustomer.invoiceeReference}) already exists`);
        }

        if (!window.confirm(
            "Are you sure you want to save this customer?\n\n" +
            "Customer Name: " + invoiceForm.customerName + "\n" +
            "Org Number: " + invoiceForm.orgNumber + "\n" +
            "Address 1: " + invoiceForm.customerAddress1 + "\n" +
            "Address 2: " + invoiceForm.customerAddress2 + "\n" +
            "Address 3: " + invoiceForm.customerAddress3 + "\n" +
            "Invoicee Reference: " + invoiceForm.invoiceeReference + "\n" +
            "KST: " + invoiceForm.kst)) {
            return;
        }

        setIsDisabled(true);

        const token = Cookies.get("dv-token");
        if (token) {
            fetch("/api/styrelsen/invoice/add-customer", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(invoiceForm)
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        setCustomers([...customers, data]);
                        setSelectedCustomer(data.customer);
                    });
                } else {
                    res.json().then(data => {
                        window.alert(data.error);
                    });
                }
            })
            .finally(() => setIsDisabled(false));
        } else {
            setIsDisabled(false);
        }
    };

    const onDeleteCustomer = () => {
        if (!selectedCustomer) { return; }

        if (window.confirm(`Are you sure you want to delete customer ${selectedCustomer}: ${invoiceForm.customerName} (${invoiceForm.invoiceeReference})?`)) {
            setIsDisabled(true);

            const token = Cookies.get("dv-token");
            if (token) {
                fetch(`/api/styrelsen/invoice/delete-customer/${selectedCustomer}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => {
                    if (res.ok) {
                        setCustomers(customers.filter(c => c.customer !== selectedCustomer));
                        setSelectedCustomer("");
                        setInvoiceForm(defaultInvoiceFormState);
                        setInvoicePreview(<></>);
                    } else {
                        res.json().then(data => {
                            window.alert(data.error);
                        });
                    }
                })
                .finally(() => setIsDisabled(false));
            } else {
                setIsDisabled(false);
            }
        }
    }

    const handleMove = (from, to) => {
        setInvoiceForm(oldData => {
            const newData = {...oldData};
            const newItems = [...oldData.items];
            const temp = newItems[from];
            newItems[from] = newItems[to];
            newItems[to] = temp;
            return {...newData, items: newItems};
        });
    };

    const createRow = (item, id) => [
        <input key={`name-${item.id}`} style={{maxWidth: "110px"}} type="text" name={`name-${id}`} value={item.name} onChange={(e) => handleItemChange(e, id)} onFocus={() => setFocusedInput(`name-${id}`)} autoFocus={focusedInput === `name-${id}`} />,
        <input key={`price-${item.id}`} style={{maxWidth: "50px"}} type="text" name={`price-${id}`} value={item.price} onChange={(e) => handleItemChange(e, id)} onFocus={() => setFocusedInput(`price-${id}`)} autoFocus={focusedInput === `price-${id}`} />,
        <input key={`quantity-${item.id}`} style={{maxWidth: "40px"}} type="number" name={`quantity-${id}`} value={item.quantity || 1} onChange={(e) => handleItemChange(e, id)} onFocus={() => setFocusedInput(`quantity-${id}`)} autoFocus={focusedInput === `quantity-${id}`} />,
        <span key={`total-${item.id}`}>{item.total}</span>,
        <a className="btn red big-text" onClick={() => onDeleteRow(id)}>X</a>
    ];

    const handleItemChange = (event, id) => {
        const { name, value } = event.target;
        setInvoiceForm(oldData => {
            const newItems = [...oldData.items];
            newItems[id] = {
                ...newItems[id],
                [name.split('-')[0]]: value
            };
            const price = parseFloat(newItems[id].price.replace(/\s/g, '').replace(',', '.'));
            const quantity = parseFloat(newItems[id].quantity.replace(/\s/g, '').replace(',', '.')) || 1;
            newItems[id].total = (price * quantity).toLocaleString('sv', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            const totalCost = newItems.reduce((sum, item) => sum + parseFloat(item.total.replace(/\s/g, '').replace(',', '.')), 0).toLocaleString('sv', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            return { ...oldData, items: newItems, totalCost };
        });
    };

    const onAddRow = () => {
        setInvoiceForm(oldData => {
            const newData = {...oldData};
            const newItems = [...oldData.items];
            newItems.push({ name: "", price: "", quantity: "1", total: "0,00" });
            return {...newData, items: newItems};
        });
    };
    
    const onDeleteRow = (id) => {
        setInvoiceForm(oldData => {
            const newData = {...oldData};
            const newItems = [...oldData.items];
            newItems.splice(id, 1);
            return {...newData, items: newItems};
        });
    };

    const validateRequiredFields = (saveCustomer = false) => {
        const { customerName, orgNumber, customerAddress1, invoiceeReference } = invoiceForm;
        const newErrors = {};
        if (!customerName) newErrors.customerName = "Required field";
        if (!orgNumber) newErrors.orgNumber = "Required field";
        if (!customerAddress1) newErrors.customerAddress1 = "Required field";
        if (!invoiceeReference) newErrors.invoiceeReference = "Required field";
        if (invoiceForm.items.length === 0 && !saveCustomer) newErrors.table = "At least one item is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onCreateInvoice = () => {
        if (!validateRequiredFields()) {
            return;
        }
        
        if (!window.confirm(
            "Are you sure you want to create this invoice?\n\n" +
            "Our reference: " + user.current.name + "\n" +
            "Customer reference: " + invoiceForm.invoiceeReference + "\n" +
            "KST: " + invoiceForm.kst + "\n\n" +

            "Customer name: " + invoiceForm.customerName + "\n" +
            "Customer org number: " + invoiceForm.orgNumber + "\n" +
            "Address 1: " + invoiceForm.customerAddress1 + "\n" +
            "Address 2: " + invoiceForm.customerAddress2 + "\n" +
            "Address 3: " + invoiceForm.customerAddress3 + "\n\n" +

            "Items:\n" +
            invoiceForm.items.map((item, i) => `  ${i + 1}. ${item.name} à ${item.price} kr x ${item.quantity} = ${item.total} kr`).join("\n") + "\n\n" +

            "Total cost: " + invoiceForm.totalCost + " kr")) {
            return;
        }

        createInvoice(invoiceForm);
    };

    if (!authorised.ok) {
        return (
            <div className="page">
                <h1>Invoice Generator</h1>
                <p>{authorised.msg}</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Invoice Generator</h1>
            <div className="invoice-container">
                <div className="invoice-form-container">
                    <div className="form-actions">
                        <select value={selectedCustomer} onChange={handleCustomerChange}>
                            <option value="">Select a customer</option>
                            {customers.map((c) => (
                                <option key={c.customer} value={c.customer}>
                                    {c.customer}: {c.customerName} ({c.invoiceeReference})
                                </option>
                            ))}
                        </select>
                        <button className="btn blue" onClick={onSaveCustomer}>SAVE CUSTOMER</button>
                        <button className="btn red" onClick={onDeleteCustomer}>DELETE</button>
                    </div>
                    <form className="invoice-form">
                        <div>
                            <label>Customer Name:</label>
                            <input
                                type="text"
                                name="customerName"
                                value={invoiceForm.customerName}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`customerName`)}
                                autoFocus={focusedInput === `customerName`}
                            />
                            {errors.customerName && <span style={{ color: "red" }}>{errors.customerName}</span>}
                        </div>
                        <div>
                            <label>Orgnr/Persnr:</label>
                            <input
                                type="text"
                                name="orgNumber"
                                value={invoiceForm.orgNumber}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`orgNumber`)}
                                autoFocus={focusedInput === `orgNumber`}
                            />
                            {errors.orgNumber && <span style={{ color: "red" }}>{errors.orgNumber}</span>}
                        </div>
                        <div>
                            <label>Address 1:</label>
                            <input
                                type="text"
                                name="customerAddress1"
                                value={invoiceForm.customerAddress1}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`customerAddress1`)}
                                autoFocus={focusedInput === `customerAddress1`}
                            />
                            {errors.customerAddress1 && <span style={{ color: "red" }}>{errors.customerAddress1}</span>}
                        </div>
                        <div>
                            <label>Address 2:</label>
                            <input
                                type="text"
                                name="customerAddress2"
                                value={invoiceForm.customerAddress2}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`customerAddress2`)}
                                autoFocus={focusedInput === `customerAddress2`}
                            />
                        </div>
                        <div>
                            <label>Address 3:</label>
                            <input
                                type="text"
                                name="customerAddress3"
                                value={invoiceForm.customerAddress3}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`customerAddress3`)}
                                autoFocus={focusedInput === `customerAddress3`}
                            />
                        </div>
                        <div>
                            <label>Invoicee Reference:</label>
                            <input
                                type="text"
                                name="invoiceeReference"
                                value={invoiceForm.invoiceeReference}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`invoiceeReference`)}
                                autoFocus={focusedInput === `invoiceeReference`}
                            />
                            {errors.invoiceeReference && <span style={{ color: "red" }}>{errors.invoiceeReference}</span>}
                        </div>
                        <div>
                            <label title="Kostnadsställe">KST:</label>
                            <input
                                type="text"
                                name="kst"
                                value={invoiceForm.kst}
                                onChange={(e) => handleInputChange(e, invoiceForm, setInvoiceForm)}
                                onFocus={() => setFocusedInput(`kst`)}
                                autoFocus={focusedInput === `kst`}
                            />
                        </div>
                    </form>

                    <div>
                        <DraggableTable columns={createColumns()} rows={invoiceForm.items.map(createRow)} onMove={handleMove} columnMaxWidth="" />
                        <button className="btn blue" onClick={onAddRow}>+</button>
                        {errors.table && <span style={{ color: "red", marginLeft: "10px" }}>{errors.table}</span>}
                    </div>
                    
                    <div className="form-actions">
                        <button className="btn blue" onClick={() => requestPreview(invoiceForm)} disabled={isDisabled}>PREVIEW</button>
                        <button className="btn green" onClick={onCreateInvoice} disabled={isDisabled}>CREATE INVOICE</button>
                    </div>
                </div>

                <div className="invoice-preview">
                    { invoicePreview }
                </div>
            </div>
        </div>
    );
};

const defaultInvoiceFormState = {
    logo: "/frontend/assets/Externallogofinal_nohelmet.png",
    customer: "",
    invoiceNumber: "",
    treasurer: "",
    invoiceeReference: "",
    kst: "",
    orgNumber: "",
    customerName: "",
    customerAddress1: "",
    customerAddress2: "",
    customerAddress3: "",
    items: [],
    totalCost: "0,00"
};

const createColumns = () => [
    "Benämning",
    "À-pris",
    "Antal",
    "Belopp",
    ""
];

export default me;