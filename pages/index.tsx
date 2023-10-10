import { NextPageContext } from 'next'
import { getSession, signOut } from 'next-auth/react'
import NavBar from '@/components/Navbar'
import Billboard from '@/components/Billboard'

import useCurrentUser  from '@/hooks/useCurrentUser'
import useMovieList from '@/hooks/useMovieList'
import MovieList from '@/components/MovieList'
import useFavorites from '@/hooks/useFavorites'

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default function Home() {
  const { data: movies = []} = useMovieList();
  
  const { data: favorites = [] } = useFavorites();
  

  return (
    <>
      <NavBar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />

      </div>
      
    </>
  )
}
