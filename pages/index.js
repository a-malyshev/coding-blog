import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import { getSortedPostsData } from '../lib/posts'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home({ allPostsData }) {
  return (
	 <Layout home>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={utilStyles.headingMd}>Rust journey</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h2 className={utilStyles.headingLg}>Blog</h2>

      <ul className={utilStyles.list}>
     	  {allPostsData.map(({ id, date, title }) => (
		<li className={utilStyles.listItem} key={id}>
		  <Link href="/posts/[id]" as={`/posts/${id}`}>
			<a>{title}</a>
		  </Link>
		  <br />
		  <small className={utilStyles.lightText}>
			<Date dateString={date} />
		  </small>
		</li>
     	  ))}
       </ul>
  	   </section>
	  </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

