import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
               active
                    ? 'flex items-center p-2 text-gray-900 rounded-lg   bg-gray-100   group' : className
            }
        >
            {children}
        </Link>
    );
}
