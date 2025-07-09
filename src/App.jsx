import { useState } from "react";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    let attempts = 0;
    const maxAttempts = 1;

    while (attempts < maxAttempts) {
      const res = await fetch(
        "https://api.thecatapi.com/v1/images/search?has_breeds=1",
        {
          headers: { "x-api-key": ACCESS_KEY },
        }
      );
      const data = await res.json();
      const catData = data[0];
      const breed = catData.breeds[0];

      const breedName = breed.name;
      const origin = breed.origin;
      const lifespan = breed.life_span;

      // Check if any attribute is banned
      if (
        !banList.includes(breedName) &&
        !banList.includes(origin) &&
        !banList.includes(lifespan)
      ) {
        setCat({
          image: catData.url,
          breed: breedName,
          origin,
          lifespan,
        });
        return;
      }
      attempts++;
    }
    alert("No new cat found. Ban list too restrictive!");
  };
  const toggleBan = (value) => {
    setBanList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="App">
      <h1>🐱 Random Cat Explorer</h1>
      <button onClick={fetchCat}>Discover New Cat</button>

      {cat && (
        <div className="cat-card">
          <img src={cat.image} alt="Random Cat" />
          <p onClick={() => toggleBan(cat.breed)}>
            <strong>Breed:</strong> {cat.breed}
          </p>
          <p onClick={() => toggleBan(cat.origin)}>
            <strong>Origin:</strong> {cat.origin}
          </p>
          <p onClick={() => toggleBan(cat.lifespan)}>
            <strong>Lifespan:</strong> {cat.lifespan} years
          </p>
        </div>
      )}

      <div className="ban-list">
        <h3>🚫 Ban List</h3>
        {banList.length === 0 ? (
          <p>No banned attributes</p>
        ) : (
          banList.map((item, index) => (
            <span
              key={index}
              onClick={() => toggleBan(item)}
              className="ban-item"
            >
              {item} ❌
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
