import '../styles/globals.css';
import { FavoritesProvider } from '../context/FavoritesContext';

function MyApp({ Component, pageProps }) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}

export default MyApp;