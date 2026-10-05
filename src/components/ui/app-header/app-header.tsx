import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo
} from '@krgaa/react-developer-burger-ui-components';

import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({
  userName
}: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');

  const isFeedActive = pathname.startsWith('/feed');

  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={`${styles.link} ${
              isConstructorActive ? styles.link_active : ''
            }`}
          >
            <BurgerIcon
              type={isConstructorActive ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={`${styles.link} ${
              isFeedActive ? styles.link_active : ''
            }`}
          >
            <ListIcon
              type={isFeedActive ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              Лента заказов
            </p>
          </NavLink>
        </div>

        <NavLink to='/' className={styles.logo}>
          <Logo className='' />
        </NavLink>

        <NavLink
          to='/profile'
          className={`${styles.link_position_last} ${styles.link} ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <ProfileIcon
            type={isProfileActive ? 'primary' : 'secondary'}
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};