import "./UserCard.css";

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-card__content">
        <div className="user-card__info">
          <h2>Käyttäjä: {user.name}</h2>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
