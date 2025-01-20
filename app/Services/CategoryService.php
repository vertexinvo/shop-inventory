<?php 
 
namespace App\Services;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CategoryService{
    public function getAllCategories()
    {
        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        // Generate a unique cache key for the page
        $cacheKey = "all_categories_page_{$page}";
    
        return Cache::remember($cacheKey, 60, function () {
            return Category::with('parent')->latest()->paginate(10);
        });
    }
    public function createCategory($request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:1000',
            'parent_id' => 'nullable',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return false;
        }
        $data = $request->all();
        $category = Category::create($data);

        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        // Generate a unique cache key for the page
        $cacheKey = "all_categories_page_{$page}";
    

        Cache::forget(  $cacheKey );

        return $category ? true : false;
    }
    public function updateCategory($request, $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' =>  'nullable|string|max:1000',
            'parent_id' => 'nullable',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return false;
        }
        $data = $request->all();
        $category = Category::find($category->id)->update($data);

        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        // Generate a unique cache key for the page
        $cacheKey = "all_categories_page_{$page}";
    
        Cache::forget($cacheKey);
        
        return $category ? true : false;
    }
}