import React from 'react';
import Header from './Header';

const Layout = ({ children, date }) => {
    return (
        <div className="container relative">
            <Header date={date} />
            <main className="flex-grow relative overflow-hidden">
                {children}
            </main>

        </div>
    );
};

export default Layout;
