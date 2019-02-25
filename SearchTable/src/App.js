import React, { Component } from "react";
//import Search from "./components/Search";
//import Table from "./components/Table";
import "./App.css";

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  };
}

const DEFAULT_QUERY = "";

const PATH_BASE = "localhost";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const url = "${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}";

const list = [
  {
    title: "React",
    url: "https://facebook.githug.io/react",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://facebook.githug.io/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  },
  {
    title: "IT Sense Web Developers",
    url: "https://itsense.pl",
    author: "Michał Górecki",
    num_comments: 32,
    points: 15,
    objectID: 3
  },
  {
    title: "Wirtualna Polska",
    url: "https://wp.pl",
    author: "Marcin Nowakowski",
    num_comments: 4,
    points: 12,
    objectID: 4
  }
];

const Search = ({ value, onChange }) => {
  return (
    <form>
      <input type="text" value={value} onChange={onChange} />
    </form>
  );
};

const Button = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
};

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => (
        <div className="table-row" key={item.objectID}>
          <span style={{ width: "40%" }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: "30%" }}>{item.author}</span>
          <span style={{ width: "10%" }}>{item.num_comments}</span>
          <span style={{ width: "10%" }}>{item.points}</span>
          <span style={{ width: "10%" }}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      ))}
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      list: list,
      searchTerm: DEFAULT_QUERY
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  componentDidMount() {
    fetch("http://localhost/reactapi", { mode: "no-cors" })
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onDismiss(id) {
    const inNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(inNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  //const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

  render() {
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={this.state.searchTerm}
            onChange={this.onSearchChange}
          />
        </div>
        <Table
          list={this.state.list}
          pattern={this.state.searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
