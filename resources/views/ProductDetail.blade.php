<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Detail</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #f8f9fa, #e9ecef);
            padding: 20px;
        }
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .card-header {
            background: linear-gradient(to right, #948f99, #c8cdd4);
            color: white;
            border-radius: 10px 10px 0 0;
            padding: 1.5rem;
        }
        .card-header h1 {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 600;
        }
        .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: white;
            transition: color 0.3s ease;
        }
        .btn-close:hover {
            color: #ffdd57;
        }
        .table th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .table td, .table th {
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <!-- Enhanced Top Bar -->
            <div class="card-header d-flex justify-content-between align-items-center">
                <h1 class="h3 mb-0">Product Details</h1>
                <button type="button" class="btn-close" onclick="window.location.href = '{{ route('product.scan') }}'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <tbody>
                            <tr>
                                <th scope="row" class="w-25">Product Code</th>
                                <td>{{ $product->code ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Name</th>
                                <td>{{ $product->name ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Model</th>
                                <td>{{ $product->model ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Specification</th>
                                <td>{{ $product->specifications ? strip_tags($product->specifications) : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Description</th>
                                <td>{{ $product->description ? strip_tags($product->description) : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Identity Type</th>
                                <td>
                                    @if($product->identity_type === 'none')
                                        None
                                    @else
                                        {{ $product->identity_type }} - {{ $product->identity_value ?? 'No' }}
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Product Price</th>
                                <td>{{ number_format($product->selling_price, 2) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Quantity</th>
                                <td>{{ $product->stock->quantity }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Categories</th>
                                <td>
                                    {{ $product->categories->count() === 0 ? 'N/A' : $product->categories->pluck('name')->implode(', ') }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Product Brands</th>
                                <td>{{ $product->brands->count() === 0 ? 'N/A' : $product->brands->pluck('name')->implode(', ') }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Product Warranty</th>
                                <td>
                                    @if($product->warranty_period === 'none')
                                        None
                                    @else
                                        {{ $product->warranty_period ?? 'none' }} - {{ $product->warranty_type }}
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Product Is Borrow</th>
                                <td>
                                    <ul class="list-unstyled">
                                        <li>Name: {{ $product->shop_name }}</li>
                                        <li>Address: {{ $product->shop_address }}</li>
                                        <li>Phone: {{ $product->shop_phone }}</li>
                                        <li>Email: {{ $product->shop_email }}</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Product Created At</th>
                                <td>{{ $product->created_at }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Supplier Invoice</th>
                                <td>{{ $product->supplier_invoice_no }} - {{ $product->supplier_name }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>