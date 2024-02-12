import React, { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryIntervalId, setRetryIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (retryIntervalId) {
        clearInterval(retryIntervalId);
      }
    };
  }, [retryIntervalId]);

  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/film/');
      if (!response.ok) {
        throw new Error('Something went wrong ... Retrying');
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));
      setMovies(transformedMovies);
      
    } catch (error) {
      setError(error.message);
      startRetry();
    }
    setIsLoading(false);
  };

  const startRetry = () => {
    setRetryIntervalId(
      setInterval(() => {
        fetchMoviesHandler();
      }, 5000)
    );
  };

  const handleCancelRetry = () => {
    clearInterval(retryIntervalId);
    setRetryIntervalId(null);
    setIsLoading(false);
    setError(null);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = (
      <div>
        <p>{error}</p>
        <button onClick={handleCancelRetry}>Cancel Retry</button>
      </div>
    );
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button> 
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
