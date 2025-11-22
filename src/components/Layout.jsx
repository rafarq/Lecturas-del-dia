import React from 'react';
import Header from './Header';

const Layout = ({ children, date }) => {
    return (
        <div className="container relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <Header date={date} />
            <main className="flex-grow relative overflow-hidden pb-4 pt-4">
                {children}
            </main>

        </div>
    );
};

export default Layout;
