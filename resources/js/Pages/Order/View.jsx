import React from 'react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Remove direct import of Printer, we'll use a more flexible approach



const View = (props) => {
    const { order } = props;
    console.log(order);
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
                        <div class="font-bold text-lg mb-2">VERTEX INVO</div>
                        <div class="text-sm text-gray-600 mb-4">
                            <div>vertexInvo.com</div>
                            <div>+92-3331325935</div>
                            <div>sales@vertexInvo.com</div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-left text-sm mb-4">
                            <div>Invoice #: <span class="font-semibold">INV-${order.id}</span></div>
                            <div>Date: <span class="font-semibold">${order.created_at_formatted}</span></div>
                            <div>Customer: <span class="font-semibold">${order.name}</span></div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="mb-4">
                            <div class="grid grid-cols-3 font-bold bg-gray-100 p-1">
                                <div>Name</div>
                                <div class="text-center">Qty</div>
                                <div class="text-right">Price</div>
                            </div>
                            ${order.items.map(item => `
                                <div class="grid grid-cols-3 border-b border-gray-200 py-1">
                                    <div class="truncate">${item.product.name}</div>
                                    <div class="text-center">${item.qty}</div>
                                    <div class="text-right">Rs. ${item.price}</div>
                                </div>
                            `).join('')}
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-right text-sm">
                            <div>Subtotal: <span class="font-semibold">Rs. 12435</span></div>
                            <div>Discount: <span class="font-semibold">Rs. 0</span></div>
                            <div class="font-bold">Total: <span class="text-lg">Rs.   8765</span></div>
                        </div>
    
                        <div class="border-t border-dashed border-gray-300 my-2"></div>
    
                        <div class="text-xs text-gray-600 mt-4">
                            <div>Thank You for Your Business!</div>
                            <div>vertexInvo.com</div>
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
            header={<h2 className=" font-semibold text-xl text-gray-800 leading-tight no-print">View Order # {order.id}</h2>}>
            <Head title="View Order" />
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
                    <button onClick={printThermalReceipt}

                        className="bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
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
                            <img src="/images/logo2.png" alt="company-logo" height="100" width="100" />
                        </div>
                        <div className="text-right">
                            <p>VERTEX INVO</p>
                            <p className="text-gray-500 text-sm mt-1">vertexInvo.com</p>
                            <p className="text-gray-500 text-sm">sales@vertexInvo.com</p>
                            <p className="text-gray-500 text-sm mt-1">+92-3331325935</p>

                            {/* <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p> */}
                        </div>
                    </div>

                    {/* Client info */}
                    <div className="grid grid-cols-2 items-center mt-8">
                        <div>
                            {/* <p className="font-bold text-gray-800">Bill to:</p> */}
                            <p>Bill to: <span className='text-gray-500'>{order.name}</span>
                                {/* <br />
            {order.address}, {order.city}, {order.country} */}
                            </p>
                            <p>Address: <span className="text-gray-500" >{order.address}, {order.city}, {order.country}</span></p>
                            <p>Email: <span className="text-gray-500">{order.email}</span></p>
                            <p>payment method: <span className="text-gray-500">{order.method}</span></p>
                            <p>Status: <span className="text-gray-500" >{order.status}</span></p>
                        </div>
                        <div className="text-right">
                            <p>
                                Invoice number: <span className="text-gray-500">INV-{order.id}</span>
                            </p>
                            <p>
                                Invoice date: <span className="text-gray-500">{order.created_at}</span>

                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="-mx-4 mt-2 flow-root sm:mx-0 py-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <colgroup>
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                  
                                </colgroup>
                                <thead className="border-b border-gray-300 text-gray-900">
                                    <tr >
                                        {/* <th scope="col" className="pl-4 py-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 whitespace-nowrap">Product Info</th> */}
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Product Info</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Order Info</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Price</th>
                                        <th scope="col" className="pl-3 pr-4 py-2 text-right text-sm font-semibold text-gray-900 sm:pr-0 whitespace-nowrap">QTY</th>
                                        <th scope="col" className="pl-3 pr-4 py-2 text-right text-sm font-semibold text-gray-900 sm:pr-0 whitespace-nowrap">Total</th>
                                    </tr>
                                </thead>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td class=" text-sm">
                                            <div class="flex items-center cursor-pointer w-max">
                                                <div >
                                                    <p class="text-sm text-black ">Name : {item.product.name}</p>
                                                    {item.product.model && <p class="text-xs text-gray-500 mt-0.5">Model :{item.product.model} </p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td class=" text-sm">
                                            <div class="flex items-center cursor-pointer w-max">
                                                <div className='mt-3'>
                                                    <p class="text-sm text-black ">Order Name : {order.name}</p>
                                                    { <p class="text-xs text-gray-500 mt-0.5">Email :{order.email} </p>}
                                                    {<p class="text-xs text-gray-500 mt-0.5">Email :{order.phone} </p>}
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="pl-4 py-2 pr-3 text-left text-sm text-gray-500 sm:pl-0 whitespace-nowrap">{item.product.name}</td> */}
                                        {/* <td className="hidden px-3 py-2 text-left text-sm text-gray-500 sm:table-cell">{item.product.description ? item.product.description : 'N/A'}</td> */}
                 
                                        <td className="hidden px-3 py-2 text-left text-sm text-gray-500 sm:table-cell">Rs. {item.price}</td>
                                        <td className="pl-3 pr-4 py-2 text-right text-sm text-gray-500 sm:pr-0">{item.qty ? item.qty : 'N/A'}</td>
                                        <td className="pl-3 pr-4 py-2 text-right text-sm text-gray-500 sm:pr-0">{order.total}</td>
                                    </tr>
                                ))}
                                <tbody>
                                    <tr>
                                        <td className="pl-4 py-2 pr-3 text-left text-sm text-gray-500 sm:pl-0 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.name}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0">
                                                <p className="text-gray-500">{order.description}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>



                            </table>

                            <tfoot className="justify-content-right">
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs. {order.total} </td>
                                </tr>
                                <tr>
                                    {/* add delivery cgarges */}
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Delivery Charges:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">
                                        Rs.{order.shipping_charges ? order.shipping_charges : '0.00'}
                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Discount:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.discount}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Exchange :</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.exchange}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Extra Charges:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.discount}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Tax:</th>

                                    <td className="pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-0">Rs.{order.discount}</td>
                                </tr>


                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 py-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total:</th>

                                    <td className="pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Rs. {order.payable_amount}</td>
                                </tr>
                            </tfoot>
                        </div>

                    </div>


                    {/* Footer
                    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
                    </div> */}
                </div>
            </div>
        </Authenticated>
    );
};

export default View;
