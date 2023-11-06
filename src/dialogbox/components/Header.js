import * as React from "react";

const Header = ({ onLogout }) => {
  return (
      <header className="h-14">
        <nav
          className="relative flex w-full items-center justify-between border-t border-gray-700 bg-slt-blue py-2 shadow-lg"
          data-te-navbar-ref>
          <div className="m-3">
            <img width="160" height="70" src={require("./../../../assets/SelltisCRM-transparent.png")} alt="Selltis" title="Selltis" />
          </div>
          <div className="lg:flex lg:items-stretch lg:flex-no-shrink lg:flex-grow">
            <div className="lg:flex lg:items-stretch lg:justify-end ml-auto">
              <a href="#" onClick={onLogout} className="flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white cursor-pointer hover:text-gray-100 no-underline flex items-center hover:bg-grey-dark">Logout</a>
            </div>
          </div>
        </nav>
      </header>
  );
}

export default Header;