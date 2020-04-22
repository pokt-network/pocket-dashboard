import {Component} from "react";
import NetworkService from "../../../core/services/PocketNetworkService";
import "./Chains.scss";

class Chains extends Component {
  constructor(props, context) {
    super(props, context);

    this.onRowSelect = this.onRowSelect.bind(this);
    this.onRowSelectAll = this.onRowSelectAll.bind(this);

    this.state = {
      chains: [],
      chosenChains: [],
    };
  }

  async componentDidMount() {
    const chains = await NetworkService.getAvailableNetworkChains();

    this.setState({chains});
  }

  onRowSelect(row, isSelect, rowIndex, e) {
    let {chosenChains} = this.state;

    if (isSelect) {
      chosenChains = [...chosenChains, row];
    } else {
      chosenChains = chosenChains.filter((chain) => chain.hash !== row.hash);
    }

    this.setState({chosenChains});
  }

  onRowSelectAll(isSelect, rows, e) {
    let {chosenChains} = this.state;

    if (isSelect) {
      chosenChains = rows;
    } else {
      chosenChains = [];
    }

    this.setState({chosenChains});
  }
}

export default Chains;
