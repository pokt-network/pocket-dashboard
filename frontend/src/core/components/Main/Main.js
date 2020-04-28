import {Component} from "react";
import _ from "lodash";

class Main extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      data: {
        searchQuery: "",
      },
      registeredItems: [],
      userItems: [],
      filteredItems: [],
      total: 0,
      averageStaked: 0,
      averageRelays: 0,
      allItemsTableLoading: false,
      userItemsTableLoading: false,
    };
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  handleSearch(dataField) {
    const {userItems} = this.state;
    const {searchQuery} = this.state.data;

    let filteredItems = userItems;

    if (searchQuery) {
      filteredItems = userItems.filter((it) =>
        _.get(it, dataField).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    this.setState({filteredItems});
  }
}

export default Main;
