<?php
 
namespace App\Services;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
 

class BrandService{

    public function getAllBrands($page = null)
    {
        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        // Generate a unique cache key for the page
        $cacheKey = "all_brands_page_{$page}";
    
        // Attempt to fetch the paginated results from cache
        return Cache::remember($cacheKey, 60, function () {
            return Brand::latest()->paginate(10);
        });
    }
    
    public function createBrand($request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return false;
        }
        $data = $request->all();
        $brand = Brand::create($data);


        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        Cache::forget('all_brands'."_page_{$page}");
        
        if($brand){
            return true;
        }
        return false;
    }

    public function updateBrand($request,$brand){

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,'.$brand->id,
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return false;
        }
        $data = $request->all();
        $brand = Brand::find($brand->id)->update($data);


        $page = $page ?? request()->input('page', 1); // Get the current page, default is 1
    
        Cache::forget('all_brands'."_page_{$page}");
        
        if($brand){
            return true;
        }
        return false;
    }

}

