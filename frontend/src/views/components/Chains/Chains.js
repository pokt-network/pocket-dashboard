import {Component} from "react";
import NetworkService from "../../../core/services/PocketNetworkService";
import "./Chains.scss";

class Chains extends Component {
  constructor(props, context) {
    super(props, context);

    this.onRowSelect = this.onRowSelect.bind(this);
    this.onRowSelectAll = this.onRowSelectAll.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChainSearch = this.handleChainSearch.bind(this);

    this.state = {
      chains: [],
      filteredChains: [],
      chosenChains: [],
      data: {
        searchChainQuery: "",
      },
    };
  }

  async componentDidMount() {
    const chains = await NetworkService.getAvailableNetworkChains();

    this.setState({chains});
  }

  handleChainSearch() {
    const {chains} = this.state;
    const {searchChainQuery} = this.state.data;

    const filteredChains = chains.filter((c) =>
      c.name.toLowerCase().includes(searchChainQuery.toLowerCase())
    );

    this.setState({filteredChains});
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
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
