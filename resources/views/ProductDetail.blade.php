<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Detail</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gradient-to-r from-gray-50 to-gray-200 p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Product Details</h1>

        <div class="overflow-x-auto">
            <table class="w-full border-collapse rounded-lg overflow-hidden">
                <tbody>
                   
                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 lg:w-1/4 md:w-1/4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Code</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->code }}</td>
                    </tr>
                  
                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Name</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->name }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Model</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->model }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Specification</th> 
                        <td class="p-4 text-gray-600 border-b">{{strip_tags( $product->specifications )}}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Description</th> 
                        <td class="p-4 text-gray-600 border-b">{{ strip_tags($product->description) }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Identity Type</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->identity_type }} - {{ $product->identity_value ?? 'No'}}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Price</th> 
                        <td class="p-4 text-gray-600 border-b">${{ number_format($product->selling_price, 2) }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Categories</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->categories->pluck('name')->implode(', ') }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Brands</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->brands->pluck('name')->implode(', ') }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Warranty</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->warranty_period ?? 'none' }} - {{ $product->warranty_type}}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Is Borrow</th> 
                        <td class="p-4 text-gray-600 border-b">
                            
                        <ul >
                           <li>Name: {{$product->shop_name}}</li>
                             <li>Address: {{$product->shop_address}}</li>
                            <li>Phone: {{$product->shop_phone}}</li>
                            <li>Email: {{$product->shop_email}}</li>
                          </ul>
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Created At</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->created_at}}</td>
                    </tr>
                    
                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Supplier Invoice</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->supplier_invoice_no}} - {{ $product->supplier_name}}</td>
                    </tr>

                    {{-- <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Stock Status</th> 
                        <td class="p-4 text-gray-600 border-b">
                            <span class="px-3 py-1 rounded-full text-sm font-semibold {{ $product->stock->status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                                {{ $product->stock->status ? 'In Stock' : 'Out of Stock' }}
                            </span>
                        </td>
                    </tr> --}}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>