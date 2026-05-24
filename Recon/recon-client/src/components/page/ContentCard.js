import React from "react";

function ContentCard({ children, className = "" }) {
  return (
    <section className={`recon-content-card ${className}`.trim()}>{children}</section>
  );
}

export default ContentCard;
