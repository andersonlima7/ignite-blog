import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

type Body =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string };

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
      body: Body[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  console.log(post);

  if (router.isFallback) {
    return <h1>Carregando post...</h1>;
  } else
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
          </div>
          {post.data.content.map(content => {
            return (
              <div key={content.heading}>
                <h2 className={styles.paragraphHeader}>{content.heading}</h2>
                {content.body.map(body => {
                  if (body.type === 'paragraph')
                    return (
                      <p key={body.text} className={styles.body}>
                        {body.text}
                      </p>
                    );
                  else if (body.type === 'image')
                    return (
                      <img
                        className={styles.bodyImage}
                        key={body.url}
                        src={body.url}
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

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = [];

  posts.results.forEach((post, index) => {
    if (index <= 1) paths.push({ params: { slug: post.uid } });
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', params.slug);

  return {
    props: {
      post: response,
    },
  };
};
