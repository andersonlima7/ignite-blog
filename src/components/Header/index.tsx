import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <a href="/">
          <img src="/assets/logo.png" alt="logo" />
        </a>
      </div>
    </header>
  );
}
