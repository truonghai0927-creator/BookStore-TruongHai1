import * as React from 'react';
import NextLink from 'next/link';
import {
  Bars3Icon,
  ShoppingCartIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

import BookTypeMenu from 'components/v2/Layout/BookTypeMenu';
import { shoppingCartState } from 'atoms';
import { useRecoilState } from 'recoil';
import { useAuth } from '../../../contexts/AuthContext';

import { calcCartItemSum } from 'lib/utils';

export interface HeaderProps {
  hideMenu?: boolean;
}

export default function Header(props: HeaderProps) {
  const { hideMenu } = props;
  const { user, logout, loading } = useAuth();

  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);

  return (
    <>
      <div className='navbar bg-base-100 mx-auto max-w-7xl mt-4 shadow-xl rounded-box'>
        <div className='navbar-start'>
          {!hideMenu && (
            <div className='dropdown'>
              <label
                tabIndex={0}
                className='btn btn-ghost btn-circle content-center'
              >
                <Bars3Icon className='w-6 h-6' />
              </label>
              <BookTypeMenu />
            </div>
          )}
        </div>
        <div className='navbar-center'>
          <NextLink href='/' className='btn btn-ghost normal-case text-xl'>
            <BookOpenIcon className='w-6 h-6' />
            Bookstore
          </NextLink>
        </div>
        <div className='navbar-end'>
          <NextLink href='/cart' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <ShoppingCartIcon className='w-6 h-6' />
              <span className='badge badge-sm indicator-item'>
                {calcCartItemSum(shoppingCart)}
              </span>
            </div>
          </NextLink>

          {!loading && (
            <>
              {user ? (
                <div className='dropdown dropdown-end'>
                  <label tabIndex={0} className='btn btn-ghost'>
                    {user.name}
                  </label>
                  <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2'>
                    <li>
                      <button onClick={logout} className='btn btn-ghost'>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className='flex gap-2'>
                  <NextLink href='/login' className='btn btn-ghost btn-sm'>
                    Login
                  </NextLink>
                  <NextLink href='/register' className='btn btn-primary btn-sm'>
                    Register
                  </NextLink>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
