import React from "react";
import "./PrintableInvoice.scss";
import FirstPage from "./FirstPage";

class PrintableInvoice extends React.Component {
  render() {
    return (
      <div className="printable-invoice">
        <FirstPage />
      </div>
    );
  }
}

export default PrintableInvoice;
