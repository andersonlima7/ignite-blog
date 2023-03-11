import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <Link href="/">
          <img className={styles.image} src="/assets/logo.png" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
