import { Link } from "react-router-dom";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  href,
  type = "button",
  disabled = false,
  ...rest
}) => {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
