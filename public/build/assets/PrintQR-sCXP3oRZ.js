import{q as o,j as e,Y as d,y as l}from"./app-CLcatgRV.js";import{A as g,Q as m}from"./AuthenticatedLayout-bYXar71n.js";import{M as c}from"./Modal-CT4dXzUw.js";import"./transition-BxL1qNdp.js";import"./ReactToastify-PvqQfwSs.js";import"./proxy-0lPKxKNC.js";const v=({products:a})=>{const r=o().props.setting;return e.jsx(e.Fragment,{children:e.jsxs(g,{header:e.jsxs(e.Fragment,{children:[e.jsx(c,{size:20,className:"mr-2 cursor-pointer text-gray-600 hover:text-gray-800 transition duration-300",onClick:()=>l.get(route("product.index")),title:"Back"}),e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"QR Codes"})]}),children:[e.jsx(d,{title:"Purchase"}),e.jsx("style",{children:`
      @media print {
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

        /* Ensure the grid layout is optimized for printing */
        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* 5 columns for printing */
          gap: 10px; /* Adjust gap for printing */
        }

        /* Ensure each QR code container fits well on the page */
        .flex.flex-col {
          page-break-inside: avoid; /* Avoid breaking QR codes across pages */
          border: 1px solid #ccc; /* Add border for better visibility */
          padding: 10px; /* Add padding for spacing */
          text-align: center; /* Center content */
        }

        /* Adjust QR code size for printing */
        .react-qr-code {
          width: 100% !important;
          height: auto !important;
          max-width: 150px; /* Limit QR code size for printing */
          margin: 0 auto; /* Center QR code */
        }

        /* Add a gap before content begins */
        .print-gap {
          margin-top: 20px;
        }

        /* Handle page breaks for large content */
        .page-break {
          page-break-before: always;
        }

        /* Hide the print button during printing */
        .hide-print {
          display: none;
        }
      }
    `}),e.jsxs("div",{className:"p-4 sm:p-6 md:p-8 lg:p-10 my-8 mx-8  rounded-lg border border-gray-300 bg-gradient-to-br from-gray-50 to-white",children:[e.jsxs("div",{className:"my-4 text-center hide-print",children:[e.jsx("h1",{className:"text-3xl font-bold mb-4 text-gray-800",children:"Purchases QR Codes"}),e.jsx("p",{className:"text-gray-600",children:"Scan the QR codes to view product details."})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2",children:a.map((i,n)=>{var t;return Array.from({length:((t=i==null?void 0:i.stock)==null?void 0:t.quantity)||1}).map((x,s)=>e.jsxs("div",{className:"flex flex-col border border-gray-200 items-center justify-center p-6 rounded-lg bg-white hover:shadow-md transition-shadow duration-300 break-inside-avoid",children:[e.jsx(m,{value:(i==null?void 0:i.code)||(i==null?void 0:i.id)||"N/A",size:150,logoOpacity:.8,className:"rounded-lg",logoImage:r.site_favicon}),e.jsx("div",{className:"mt-3 text-sm font-medium text-gray-700",children:(i==null?void 0:i.code)||(i==null?void 0:i.id)||"N/A"})]},`${n}-${s}`))})}),e.jsx("div",{className:"mt-8 text-center hide-print",children:e.jsx("button",{onClick:()=>window.print(),className:"bg-black text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300",children:"Print QR Codes"})})]})]})})};export{v as default};
