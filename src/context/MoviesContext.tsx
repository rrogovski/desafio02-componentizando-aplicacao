import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesContextData {
  genres: GenreResponseProps[];
  selectedGenreId: number;
  selectedGenre: GenreResponseProps;
  movies: MovieProps[];
  movie: MovieProps;
  handleClickButton: (id: number) => void;
}

interface MoviesProviderProps {
  children: ReactNode;
}

export const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData);

export function MoviesProvider({ children }: MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [movie, setMovie] = useState<MovieProps>({} as MovieProps);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres')
    .then(response => setGenres(response.data))
  },[]);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
    .then(response => setMovies(response.data));

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`)
    .then(response => setSelectedGenre(response.data));

  }, [selectedGenreId]);

  return (
    <MoviesContext.Provider value={{
      genres,
      selectedGenreId,
      selectedGenre,
      movies,
      movie,
      handleClickButton,
    }}>
      { children }
    </MoviesContext.Provider>
  )
}
