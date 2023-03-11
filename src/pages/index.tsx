import { GetStaticProps } from 'next';
import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [currentPosts, setCurrentPosts] = useState(postsPagination);

  function loadMorePosts() {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data =>
        setCurrentPosts(prevState => ({
          results: [...prevState.results.concat(data.results)],
          next_page: data.next_page,
        }))
      );
  }

  return (
    <div className={styles['content-container']}>
      <div className={styles.content}>
        {currentPosts.results.map(post => {
          const data = post.data;
          return (
            <div key={post.uid}>
              <p className={styles.title}>{data.title}</p>
              <p className={styles.subtitle}>{data.subtitle}</p>
              <div className={styles['info-container']}>
                <div className={styles['info-content']}>
                  <FiCalendar />
                  <span>
                    {format(new Date(post.first_publication_date), 'PP', {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className={styles['info-content']}>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles['button-container']}>
          {currentPosts.next_page ? (
            <button className={styles.loadButton} onClick={loadMorePosts}>
              Carregar mais posts
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 2 });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
  // TODO
};
