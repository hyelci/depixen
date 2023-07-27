const Card = ({ card }) => {
  return (
    <div>
      <p className="title">New Title</p>
      <div className="form-content">
        <p className="card-title">{card.title}</p>
        <p className="textarea-placeholder">{card.description}</p>
        <img className="image" src={card.image} />
      </div>
    </div>
  );
};

export default Card;
