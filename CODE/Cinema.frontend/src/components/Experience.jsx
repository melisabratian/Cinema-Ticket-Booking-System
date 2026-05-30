function Experience() {
  const experiences = [
    {
      title: "VIP Hall",
      text: "A private premium cinema hall with comfortable seats, more space and a quieter atmosphere."
    },
    {
      title: "Premium Seats",
      text: "Wider seats with better positioning, designed for a more relaxing cinema experience."
    },
    {
      title: "Dolby Atmos",
      text: "Immersive sound that makes every action scene, soundtrack and dialogue feel more realistic."
    },
    {
      title: "Large Screen Experience",
      text: "A larger projection surface for blockbuster movies, premieres and special screenings."
    }
  ];

  return (
    <section id="experience" className="info-section">
      <div className="section-heading">
        <span>Cinema experience</span>
        <h2>More than a movie</h2>
        <p>
          The cinema experience combines technology, comfort and atmosphere for a complete night out.
        </p>
      </div>

      <div className="info-grid">
        {experiences.map((item) => (
          <div className="info-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
