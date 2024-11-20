<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
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
        $categories = Category::latest()->paginate(10);
        return Inertia::render('Category/List', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Category/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories,name',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        $category = Category::create($data);
        return redirect()->back()->with('message', 'Category created successfully');
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
        $category = Category::find($category->id);
        return Inertia::render('Category/Edit', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
       
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories,name,'.$category->id,
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        $category = Category::find($category->id)->update($data);
        return redirect()->back()->with('message','Category updated successfully');
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
       $bulkdestroy = Category::whereIn('id', explode(',', $request->ids))->delete();
       session()->flash('message', 'Category deleted successfully');
       return back();
    }
}
