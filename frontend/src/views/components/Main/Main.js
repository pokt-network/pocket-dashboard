import {Component} from "react";

class Main extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      data: {
        searchQuery: "",
      },
    };
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  handleSearch() {
    const {userNodes} = this.state;
    const {searchQuery} = this.state.data;

    let filteredNodesApps = userNodes;

    if (searchQuery) {
      filteredNodesApps = userNodes.filter((a) =>
        a.pocketApplication.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    this.setState({filteredNodesApps});
  }
}

export default Main;
