import React from "react";

function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="recon-page-header">
      <div>
        <h1 className="recon-page-header__title">{title}</h1>
        {subtitle ? <p className="recon-page-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="recon-page-header__actions">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
