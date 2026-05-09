import * as React from 'react';
import NextLink from 'next/link';
import Header, { HeaderProps } from 'components/v2/Layout/Header';

export interface CommonLayoutProps {
  children?: any;
  headerProps?: HeaderProps;
}

export default function CommonLayout(props: CommonLayoutProps) {
  const { headerProps, children } = props;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header {...headerProps} />

        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}