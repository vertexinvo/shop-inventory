<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Detail</title>

</head>
<body class="bg-gradient-to-r from-gray-50 to-gray-200 p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <div class="flex justify-between items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Product Details</h1>
        <button type="button" onclick="window.location.href = '{{ route('product.scan') }}'">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
            </button>    
    </div>
        
        <div class="overflow-x-auto">
            <table class="w-full border-collapse rounded-lg overflow-hidden">
                <tbody>
                   
                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 lg:w-1/4 md:w-1/4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Code</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->code ?? 'N/A' }}</td>
                    </tr>
                  
                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Name</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->name  ?? 'N/A' }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Model</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->model ?? 'N/A' }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Specification</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->specifications ? strip_tags( $product->specifications ) : 'N/A' }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Description</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->description ? strip_tags($product->description) : 'N/A' }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Identity Type</th> 
                        <td class="p-4 text-gray-600 border-b">
                            @if($product->identity_type === 'none')
                            None
                            @endif
                            @if($product->identity_type !== 'none')
                            {{ $product->identity_type }} - {{ $product->identity_value ?? 'No'}}
                            @endif
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Price</th> 
                        <td class="p-4 text-gray-600 border-b">{{ number_format($product->selling_price, 2) }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Quantity</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->stock->quantity }}</td>
                    </tr>


                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Categories</th> 
                        <td class="p-4 text-gray-600 border-b">
                            {{ $product->categories->count() === 0 ? 'N/A' : $product->categories->pluck('name')->implode(', ') }}
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Brands</th> 
                        <td class="p-4 text-gray-600 border-b">{{ $product->brands->count() === 0 ? 'N/A' : $product->brands->pluck('name')->implode(', ')  }}</td>
                    </tr>

                    <tr class="hover:bg-gray-50 transition duration-200">
                        <th class="p-4 text-left text-gray-700 font-semibold bg-gray-200 border-b">Product Warranty</th> 
                        <td class="p-4 text-gray-600 border-b">
                            @if($product->warranty_period === 'none')
                                None
                            @endif
                            @if($product->warranty_period !== 'none')
                                {{ $product->warranty_period ?? 'none' }} - {{ $product->warranty_type}}
                            @endif
                        </td>
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

                    
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>