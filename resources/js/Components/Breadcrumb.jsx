import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => {
    const { breadcrumbs } = usePage().props;

    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return (
        <nav className="font-medium text-gray-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center space-x-1 md:space-x-2">
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <FaChevronRight className="w-2.5 h-2.5 text-gray-400" />
                        )}
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-gray-900 mx-1">{item.title}</span>
                        ) : (
                            <Link
                                href={item.url}
                                className="text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                {item.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
