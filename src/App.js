import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Search from '../src/components/Search/Search';
import Table from '../src/components/Table/Table';
import Button from '../src/components/Button/Button';
import Loading from '../src/components/Loading/Loading';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '100';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    };

  }

  setSearchTopStories = (result) => {
    //this.setState({ result });
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results, 
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    /*fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);*/

      this.setState({ isLoading: true });

      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this.setSearchTopStories(result.data))
        .catch(error => this.setState({ error }));
  }

  needsToSearchTopStories = searchTem => {
    return !this.state.results[searchTem];
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    
    event.preventDefault();
  }
  
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }                                   

  render() {
    const { 
      results, 
      searchTerm,
      searchKey, 
      error, 
      isLoading 
    } = this.state;
    
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onSubmit={this.onSearchSubmit}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
      { error 
        ? <div className="interactions">
          <p>Something went wrong.</p>
        </div>
        : <Table 
          list={list} 
          pattern={searchTerm}
        />
      }
      { isLoading
        ? <Loading />
        : <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      }
      </div>
    );
  }
}

export default App;
