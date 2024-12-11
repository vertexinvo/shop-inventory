<?php
 
namespace App\Services;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
 

class BrandService{

    public function getAllBrands()
    {
        return Brand::latest()->paginate(10);
    }

    public function createBrand($request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:brands,name',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        $brand = Brand::create($data);
        
        if($brand){
            return true;
        }
        return false;
    }

    public function updateBrand($request,$brand){

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:brands,name,'.$brand->id,
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return false;
        }
        $data = $request->all();
        $brand = Brand::find($brand->id)->update($data);
        if($brand){
            return true;
        }
        return false;
    }

}

