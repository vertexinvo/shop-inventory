import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div class="font-[sans-serif]">
      <div class="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div class="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 class="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Login for Exclusive Access
            </h2>
            <p class="text-sm mt-6 text-gray-800">Immerse yourself in a hassle-free login journey with our intuitively designed login form. Effortlessly access your account.</p>
            {/* if current route is login the show this */}
            {route().current('login') && (
                    <p class="text-sm mt-12 text-gray-800">Don't have an account <Link href={route('register')} class="text-blue-600 font-semibold hover:underline ml-1">Register here</Link></p>
            )}
              {route().current('register') && (
                    <p class="text-sm mt-12 text-gray-800">Already have an account <Link href={route('login')} class="text-blue-600 font-semibold hover:underline ml-1">Login here</Link></p>
            )}

          </div>


            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
            </div>
      </div>
    </div>
    );
}
