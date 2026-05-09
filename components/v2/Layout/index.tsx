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
      <div className="min-h-full bg-gray-50">
        <Header {...headerProps} />

        <main>
          <div className="max-w-6xl mx-auto px-4 py-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}