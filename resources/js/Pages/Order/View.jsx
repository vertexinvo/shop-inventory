import React from 'react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from '@/Components/Modal';
// Remove direct import of Printer, we'll use a more flexible approach
import { MdKeyboardBackspace } from "react-icons/md";
import { QRCode } from 'react-qrcode-logo';

const View = (props) => {
    const { order } = props;

    const setting = usePage().props.setting;

    console.log("setting",setting);

    const generatePDF = () => {
        const input = document.getElementById('invoice');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF('p', 'pt', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth() - 20;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`Invoice_${order.id}.pdf`);
        });
    };
    const printThermalReceipt = () => {
        // Check if browser supports printing
        if (!window.print) {
            alert("Printing is not supported in this browser.");
            return;
        }
        // Create a new window for thermal-like receipt printing
        const printWindow = window.open('', 'PRINT', 'height=600,width=400');
        const currentDateTime = new Date().toLocaleString();

        printWindow.document.write(`
            <html>
                <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { 
                            font-family: monospace; 
                            max-width: 300px; 
                            margin: 0 auto; 
                        }
                    </style>
                </head>
                <body class="p-4 bg-white">
                    <div class="border-2 border-dashed border-gray-300 p-4 text-center">
                        <h1 class="text-2xl font-bold mb-4">Invoice</h1>
                        
                        <div class="text-sm text-gray-600 mb-4">
                            <div>${setting.site_title || 'VERTEX INVO'}</div>
                            <div>${setting.site_phone || 'N/A'}</div>
                            <div>${setting.site_email || 'N/A'}</div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-left text-sm mb-4">
                            <div>Invoice #: <span class="font-semibold">INV-${order.id ? order.id : 'N/A'}</span></div>
                            <div>Date: <span class="font-semibold">${currentDateTime || 'N/A'}</span></div>
                            <div>Customer: <span class="font-semibold">${order?.name || 'N/A'}</span></div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="mb-4">
                            <div class="grid grid-cols-3 font-bold bg-gray-100 p-1">
                                <div>Name</div>
                                <div class="text-center">Qty</div>
                                <div class="text-right">Price</div>
                            </div>
                           ${order?.items?.map(item => `
                                <div class="grid grid-cols-3 border-b border-gray-200 py-1">
                                        <div class="truncate">${item.product?.name ? item.product?.name : 'N/A'}</div>
                                        <div class="text-center">${item.qty ? item.qty : 'N/A'}</div>
                                        <div class="text-right">Rs. ${item.price ? item.price : 'N/A'}</div>
                                    </div>
                            `).join('')}
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-right text-sm">
                            <div>Subtotal: <span class="font-semibold">Rs. ${ order.total || '0.00'}</span></div>
                            <div>Discount: <span class="font-semibold">Rs. ${ order.discount || '0.00'}</span></div>
                            <div>Exchange: <span class="font-semibold">Rs. ${ order.exchange || '0.00'}</span></div>
                            <div>Tax: <span class="font-semibold">Rs. ${order.tax_fee || '0.00'}</span></div>
                            <div>Shipping: <span class="font-semibold">Rs. ${order.shipping_charges || '0.00'}</span></div>
                            <div>Extra Charges: <span class="font-semibold">Rs. ${order.extra_charges || '0.00'}</span></div>
                            <div class="border-t border-dashed border-gray-300 my-2"></div>

                            <div class="font-bold">Total: <span class="text-lg">Rs.  ${order.payable_amount ? order.payable_amount : '0.00'}</span></div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-xs text-gray-600 mt-4">
                            <div>Thank You for Your Business!</div>
                            <div>vertexinvo.com</div>
                        </div>
                    </div>
                    
                    <script>
                        window.onload = function() { 
                            window.print(); 
                            window.close(); 
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };
    return (
        <Authenticated auth={props.auth} errors={props.errors}
            header={
                <>
                    <MdKeyboardBackspace
                        size={20}
                        className="mr-2 cursor-pointer"
                        onClick={() => router.get(route('order.index'))}
                        title="Back"
                    />
                    <h2 className=" font-semibold text-xl text-gray-800 leading-tight no-print">View Sale # { order.id || 'N/A'}</h2>
                </>}>
            <Head title="View Sale" />
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                        .print-gap {
                            margin-top: 100px;
                        }
                          /* Hide unnecessary elements */
    .no-print,
    nav,
    aside,
    .fixed, 
    .toastify-container,
    .ConfirmModal {
        display: none !important;
    }

    /* Adjust main content for full width */
    .sm\\:ml-64 {
        margin-left: 0 !important;
    }

    .print-w-full {
        width: 100%;
    }

    /* Ensure a gap before content begins */
    .print-gap {
        margin-top: 100px;
    }

    /* Handle page breaks for large content */
    .page-break {
        page-break-before: always;
    }  
                        
                        
                    }
                `}
            </style>


            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
                {/* Action Buttons */}
                <div className="flex justify-end mb-4 no-print">
                    <button onClick={() => router.get(route('order.index'))}

                        className="bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
                    >
                        Close
                    </button>
                    <button onClick={printThermalReceipt}

                        className="ml-2 bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
                    >
                        Thermal Print
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="ml-2 bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
                    >
                        Print PDF
                    </button>


                </div>

                <div className="max-w-10xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            {/* Company logo */}
                            <img src={  setting.site_logo ||  "/images/logo2.png"} alt="company-logo" height="100" width="100" />
                        </div>
                        <div className="text-right">
                            <p> {setting.site_title || 'VERTEX INVO'} </p>
                            <p className="text-gray-500 text-sm mt-1"> {setting.site_phone || 'N/A'}</p>
                            <p className="text-gray-500 text-sm">{setting.site_email || 'N/A'}</p>
                            {/* <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p> */}
                        </div>
                    </div>

                    {/* Client info */}
                    <div className="grid grid-cols-2 items-center mt-8">
                        <div>
                            {/* <p className="font-bold text-gray-800">Bill to:</p> */}
                            <p>Bill to: <span className='text-gray-500'>{ order.name || 'N/A'}</span>
                                {/* <br />
            {order.address}, {order.city}, {order.country} */}
                            </p>
                            <p>Address: <span className="text-gray-500" >{order.address || 'N/A'}</span></p>
                            <p>Email: <span className="text-gray-500">{order.email || 'N/A'}</span></p>
                            <p>Phone: <span className="text-gray-500">{order.phone || 'N/A'}</span></p>
                            <p>payment method: <span className="text-gray-500">{order.method || 'N/A'}</span></p>
                            <p>Status: <span className="text-gray-500" >{order.status || 'N/A'}</span></p>
                        </div>
                        <div className="text-right">
                            <p>
                                Invoice number: <span className="text-gray-500">INV-{order.id || 'N/A'}</span>
                            </p>
                            <p>
                                Invoice date: <span className="text-gray-500">{order.order_date || 'N/A'}</span>

                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="-mx-4 mt-2 flow-root sm:mx-0 py-4">
                        <div className="overflow-x-auto">

                            <div className="order-items-section">
                                <div className="text-gray-800 text-sm font-bold mb-4">Order Items</div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto mb-8 border-collapse border border-gray-300">
                                        <colgroup>
                                            <col className="w-full sm:w-1/3" />
                                            <col className="w-full sm:w-1/6" />
                                            <col className="w-full sm:w-1/6" />
                                            <col className="w-full sm:w-1/6" />
                                        </colgroup>
                                        <thead className="border-b border-gray-300 bg-gray-100 text-gray-900">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    Product Info
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    Price
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-2 text-right text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    QTY
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-2 text-right text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item,index) => (
                                                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                                    <td className="px-3 py-2 text-sm text-gray-700">
                                                        <div className="flex items-start">
                                                            <div>
                                                                <p className="font-medium text-black">
                                                                    Name: {item.product?.name || "N/A"}
                                                                </p>
                                                                {item.product.model && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Model: {item.product?.model || "N/A"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-sm text-gray-700">
                                                        Rs. {item.price || "N/A"}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-sm text-gray-700">
                                                        {item.qty || "N/A"}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-sm text-gray-700">
                                                        Rs. {order.total || "N/A"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Exchange Items */}

                            {order?.exchange_items?.length > 0 && (
                                <div className="exchange-items-section">
                                    <div className="text-gray-800 text-sm font-bold mb-4">Exchange Items</div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto mb-8 border-collapse border border-gray-300">
                                            <colgroup>
                                                <col className="w-full sm:w-1/3" />
                                                <col className="w-full sm:w-1/6" />
                                                <col className="w-full sm:w-1/6" />
                                                <col className="w-full sm:w-1/6" />
                                            </colgroup>
                                            <thead className="border-b border-gray-300 bg-gray-100 text-gray-900">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                    >
                                                        Product Info
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-2 text-right text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                    >
                                                        QTY
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-2 text-right text-sm font-semibold text-gray-900 whitespace-nowrap"
                                                    >
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order?.exchange_items?.map((item) => (
                                                    <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50">
                                                        <td className="px-3 py-2 text-sm text-gray-700">
                                                            <div className="flex items-start">
                                                                <div>
                                                                    <p className="font-medium text-black">
                                                                        {item.name || "N/A"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Model: {item.model || "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-700">
                                                            Rs. {item.purchase_price || "N/A"}
                                                        </td>
                                                        <td className="px-3 py-2 text-right text-sm text-gray-700">
                                                            {item.quantity || "N/A"}
                                                        </td>
                                                        <td className="px-3 py-2 text-right text-sm text-gray-700">
                                                            Rs. {item.total || "N/A"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}


                            <div className='flex justify-between'>
                            <tfoot className="justify-content-right">
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal:</th>
                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs. {order.total || '0.00'} </td>
                                </tr>
                                <tr>
                                    {/* add delivery cgarges */}
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Delivery Charges:</th>
                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">
                                        Rs.{order.shipping_charges || '0.00'}
                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Discount:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.discount || '0.00'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Exchange :</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.exchange || '0.00'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Extra Charges:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.extra_charges || '0.00'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Tax:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.tax_fee || '0.00'}</td>
                                </tr>


                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 py-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total:</th>

                                    <td className="pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Rs. {order.payable_amount || '0.00'}</td>
                                </tr>
                            </tfoot>
                            <QRCode  value={route('order.show', { id: order.id })} size={150} logoImage={setting.site_favicon} logoOpacity={0.8} />
                            </div>

                            
                        </div>

                    </div>


                    {/* Footer */}
                    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                        developed by <strong>vertexInvo</strong>
                    </div>
                </div>
            </div>


        </Authenticated>
    );
};

export default View;
