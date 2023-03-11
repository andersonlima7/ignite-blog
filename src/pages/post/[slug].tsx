import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import PrismicDOM from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  const [timeToRead, setTimeToRead] = useState(0);
  console.log(post);

  useEffect(() => {
    const numbOfWords = post.data.content.reduce((accumulator, item) => {
      const text = PrismicDOM.RichText.asText(item.body);
      const arrayOfWords = text.split(/\s+/);
      return accumulator + arrayOfWords.length;
    }, 0);

    const time = Math.ceil(numbOfWords / 200);
    setTimeToRead(time);
  }, []);

  return (
    <div className={styles.container}>
      <img
        src={post.data.banner.url}
        width="100%"
        height="400px"
        className={styles.banner}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>{post.data.title}</h1>
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
          <div className={styles['info-content']}>
            <FiClock />
            <span>{timeToRead} min</span>
          </div>
        </div>
        {post.data.content.map((content, index) => {
          return (
            <div key={content.heading ?? `content${index}`}>
              <h2 className={styles.paragraphHeader}>{content.heading}</h2>
              {content.body.map(body => {
                if (body['type'] === 'paragraph')
                  return (
                    <p key={body.text} className={styles.body}>
                      {body.text}
                    </p>
                  );
                else if (body['type'] === 'image')
                  return (
                    <img
                      className={styles.bodyImage}
                      key={body['url']}
                      src={body['url']}
                    />
                  );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map((post, index) => {
    return { params: { slug: post.uid } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  return {
    props: {
      post: response,
    },
  };
};
