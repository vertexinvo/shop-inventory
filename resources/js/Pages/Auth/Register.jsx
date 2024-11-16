import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

         
            {/* here */}
            
            <form onSubmit={submit}  class="max-w-md md:ml-auto w-full">
            <h3 class="text-gray-800 text-3xl font-extrabold mb-8">
              Sign in
            </h3>



            <div>


                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="bg-gray-100  w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent" placeholder="Name"
                    
                    autoComplete="name"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />

                <InputError message={errors.name} className="mt-2" />
                </div>



                <div class="mt-4">


                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                       className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent" placeholder="Email address"
                        autoComplete="username"
                        
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">


                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                         className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent" placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>


             

                    <div className="mt-4">
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent" placeholder="Confirm Password"
                     
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                      <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>




              

              <div class="!mt-8">
              <PrimaryButton className="w-full flex items-center justify-center shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" disabled={processing}>
              Register
                    </PrimaryButton>
              
            </div>

             
            </form>




            
        </GuestLayout>
    );
}
