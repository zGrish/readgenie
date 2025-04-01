const API_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org';

// Helper function to parse book data from API response
const parseBookData = (book) => {
  // Extract the key (removing '/works/' prefix if present)
  const key = book.key || '';
  
  // Get cover ID from either covers or cover_i field
  const coverId = book.covers?.[0] || book.cover_i;
  
  // Construct cover URL if cover ID exists
  const coverUrl = coverId 
    ? `${COVERS_BASE_URL}/b/id/${coverId}-M.jpg` 
    : null;
  
  // Extract author names
  let authors = [];
  if (book.author_name) {
    authors = book.author_name;
  } else if (book.authors) {
    authors = book.authors.map(author => 
      typeof author === 'string' ? author : author.name || 'Unknown Author'
    );
  }
  
  return {
    key,
    title: book.title || 'Unknown Title',
    authors,
    coverUrl,
    publishDate: book.first_publish_year || book.publish_date || 'Unknown',
    subjects: book.subject || [],
    rating: book.ratings_average || 0,
    description: book.description || '',
  };
};

// Get trending books (using subjects like 'popular' or 'trending')
export const getTrendingBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/popular.json?limit=20`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.works.map(parseBookData);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    throw error;
  }
};

// Get books by subject/genre
export const getBooksBySubject = async (subject) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subject}.json?limit=20`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.works.map(parseBookData);
  } catch (error) {
    console.error(`Error fetching books for subject ${subject}:`, error);
    throw error;
  }
};

// Search books by query
export const searchBooks = async (query, page = 1) => {
  const offset = (page - 1) * 20;
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=20&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      books: data.docs.map(parseBookData),
      numFound: data.numFound || 0,
      page
    };
  } catch (error) {
    console.error(`Error searching books for query ${query}:`, error);
    throw error;
  }
};

// Get detailed book information by key
export const getBookDetails = async (bookKey) => {
  try {
    // Fetch book details
    const bookResponse = await fetch(`${API_BASE_URL}${bookKey}.json`);
    
    if (!bookResponse.ok) {
      throw new Error(`API error: ${bookResponse.status}`);
    }
    
    const bookData = await bookResponse.json();
    
    // Extract author keys
    const authorKeys = bookData.authors?.map(author => 
      author.author?.key || author.key
    ).filter(Boolean) || [];
    
    // Fetch author details if there are any author keys
    const authorDetails = await Promise.all(
      authorKeys.map(async (authorKey) => {
        try {
          const authorResponse = await fetch(`${API_BASE_URL}${authorKey}.json`);
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            return {
              key: authorKey,
              name: authorData.name || 'Unknown Author',
              bio: authorData.bio?.value || authorData.bio || 'No biography available'
            };
          }
          return { key: authorKey, name: 'Unknown Author', bio: 'No biography available' };
        } catch (error) {
          console.error(`Error fetching author details for ${authorKey}:`, error);
          return { key: authorKey, name: 'Unknown Author', bio: 'No biography available' };
        }
      })
    );
    
    // Fetch related books (using subject or author)
    let relatedBooks = [];
    if (bookData.subjects && bookData.subjects.length > 0) {
      const subject = bookData.subjects[0].replace(/\s+/g, '_').toLowerCase();
      try {
        const relatedResponse = await fetch(`${API_BASE_URL}/subjects/${subject}.json?limit=6`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current book and limit to 5 books
          relatedBooks = relatedData.works
            .filter(book => book.key !== bookKey)
            .slice(0, 5)
            .map(parseBookData);
        }
      } catch (error) {
        console.error(`Error fetching related books for subject ${subject}:`, error);
      }
    }
    
    // Get cover URL
    const coverId = bookData.covers?.[0];
    const coverUrl = coverId ? `${COVERS_BASE_URL}/b/id/${coverId}-L.jpg` : null;
    
    // Parse and structure the book details
    return {
      key: bookData.key,
      title: bookData.title,
      publishDate: bookData.first_publish_date || 'Unknown',
      coverUrl,
      description: bookData.description?.value || bookData.description || 'No description available',
      subjects: bookData.subjects || [],
      authorDetails,
      relatedBooks,
      rating: bookData.ratings_average || 0
    };
  } catch (error) {
    console.error(`Error fetching book details for ${bookKey}:`, error);
    throw error;
  }
};