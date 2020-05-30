import {Component} from "react";
import "./CreateForm.scss";

class CreateForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.state = {
      redirectPath: "",
      redirectParams: {},
      data: {
        name: "",
        owner: "",
        url: "",
        contactEmail: "",
        description: "",
      },
      imgError: "",
      icon: "",
      created: false,
      error: {
        show: false,
        message: "",
      },
    };
  }

  async handleDrop(img, error) {
    if (error) {
      this.setState({icon: "", imgError: error});
      return;
    }

    const toDataUrl = (url, callback) => {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var reader = new FileReader();

        reader.onloadend = function () {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    };

    toDataUrl(img.preview, (base64data) => {
      this.setState({icon: base64data, imgError: ""});
    });
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }
}

export default CreateForm;
