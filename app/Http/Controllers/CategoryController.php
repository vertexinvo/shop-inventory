<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Facades\CategoryService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = CategoryService::getAllCategories();
        return Inertia::render('Category/List', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Category/Add', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $response = CategoryService::createCategory($request);
        return $response ? session()->flash('message', 'Brand created successfully') : back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $categories = Category::all();
        $category = Category::with('parent')->find($category->id);
        return Inertia::render('Category/Edit', compact('category', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $response = CategoryService::updateCategory($request, $category);
        return $response ? session()->flash('message', 'Brand created successfully') : back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category = Category::find($category->id);
        $category->delete();
        return redirect()->back()->with('message', 'Category deleted successfully');
    }

    public function bulkdestroy(Request $request)
    {
        Category::whereIn('id', explode(',', $request->ids))->delete();
        session()->flash('message', 'Category deleted successfully');
        return back();
    }
}
