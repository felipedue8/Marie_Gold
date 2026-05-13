import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./RotatingMenu.css";

export default function RotatingMenu({ links, position = "top" }) {
  // position: "top" (debajo del header), "bottom" (antes del footer), "fixed-bottom" (pegado abajo)
  let posClass = "";
  if (position === "bottom") posClass = "rotating-menu-bottom";
  if (position === "fixed-bottom") posClass = "rotating-menu-fixed-bottom";

  // Detectar si es móvil
  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`rotating-menu-container ${posClass}`}>
      <div
        className={`rotating-menu-track${isMobile ? ' mobile' : ''}`}
        tabIndex={0}
      >
        {(isMobile ? links : links.concat(links)).map((link, idx) => (
          <Link className="rotating-menu-link" to={link.ruta} key={link.ruta + idx}>
            {link.nombre}
          </Link>
        ))}
      </div>
    </div>
  );
}
