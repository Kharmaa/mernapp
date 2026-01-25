import "./Card.css";

const Card = ({ title, rightTitle, children, className = "" }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card__header">
        <span>{title}</span>
        {rightTitle && (
          <span className="dashboard-card__header-right">{rightTitle}</span>
        )}
      </div>
      <div className="dashboard-card__content">{children}</div>
    </div>
  );
};

export default Card;
