import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <a href="/" className={styles.link}>
        <img src="/assets/logo.png" alt="logo" />
      </a>
    </header>
  );
}
