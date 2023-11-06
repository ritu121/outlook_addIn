import * as React from "react";
import PropTypes from "prop-types";

export default class Progress extends React.Component {
  render() {
    const { logo, message, title } = this.props;

    return (
      <div className="my-6 mx-3">
        <div className="flex justify-center">
          <img width="200" height="100" src={logo} alt={title} title={title} />
        </div>
        <div className="flex justify-center mt-3">
          <span className="w-4 h-4 my-12 mx-1 bg-blue-700 rounded-full animate-loader"></span>
          <span className="w-4 h-4 my-12 mx-1 bg-blue-700 rounded-full animate-loader animation-delay-200"></span>
          <span className="w-4 h-4 my-12 mx-1 bg-blue-700 rounded-full animate-loader animation-delay-400"></span>
        </div>
      </div>
      // <section className="ms-welcome__progress ms-u-fadeIn500">
      //   <img width="90" height="90" src={logo} alt={title} title={title} />
      //   <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">{title}</h1>
      //   {/* <Spinner size={SpinnerSize.large} label={message} /> */}
      // </section>
    );
  }
}

Progress.propTypes = {
  logo: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
};
