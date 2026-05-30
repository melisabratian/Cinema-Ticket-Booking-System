function Offers() {
  const offers = [
    {
      title: "Student Discount",
      text: "Students can benefit from reduced ticket prices during weekdays with a valid student card."
    },
    {
      title: "Family Pack",
      text: "Special package for families that includes multiple tickets and a popcorn combo."
    },
    {
      title: "Weekend Combo",
      text: "Movie ticket plus popcorn and drink at a better price during weekend screenings."
    },
    {
      title: "Birthday Offer",
      text: "Celebrate your birthday with friends and receive a special discount for group bookings."
    }
  ];

  return (
    <section id="offers" className="info-section offers-section">
      <div className="section-heading">
        <span>Special offers</span>
        <h2>Deals for every movie night</h2>
        <p>
          The offers section presents different discounts and packages that make the cinema experience more accessible.
        </p>
      </div>

      <div className="info-grid">
        {offers.map((offer) => (
          <div className="info-card offer-card" key={offer.title}>
            <h3>{offer.title}</h3>
            <p>{offer.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Offers;
