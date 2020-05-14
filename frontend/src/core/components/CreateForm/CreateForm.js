import {Component} from "react";
import "./CreateForm.scss";

class CreateForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.state = {
      data: {
        name: "",
        owner: "",
        url: "",
        contactEmail: "",
        description: "",
      },
      icon: "",
      created: false,
      error: false,
    };
  }

  async handleDrop(img) {
    // Fetch image blob data and converts it to base64
    const blob = await fetch(img).then((r) => r.blob());

    const reader = new FileReader();

    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result;

      this.setState({icon: base64data});
    };
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }
}

export default CreateForm;
