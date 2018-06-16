/* 
  Props To SearchBar
    itemClick: function to run when one of the search results is clicked
      params: item(object)
    itemEnter: function to run when one of the search results is selected throw the up and down button and enter is pressed.
     params: item(object)
    submit: function to call when the submit button is clicked
     params: Array of search results
 */

import React, { Component } from 'react';
import './PeopleSearchBar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import { searchresults } from './searchdbpedia';

class PeopleSearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchterm: '',
      isfocused: false,
      current: -1,
      noresults: false,
      // latest promise id
      reqseqid: 0,
      filteredList: []
    }
  }

  handleOnKeyDown(event) {

    let kc = event.keyCode;

    if(kc === 40 && (this.state.current < this.state.filteredList.length - 1)){
      this.setState({ current: this.state.current + 1 });
    }else if(kc === 38 && (this.state.current > 0)){
      this.setState({ current: this.state.current - 1 });
    }else if(kc === 13){
      event.preventDefault();
      let selected = this.state.filteredList[this.state.current];
      this.setState({ searchterm: selected.name });
      this.props.itemEnter(selected);
    }
  }

  handleInput(event) {
    let searchterm = event.target.value;
    let reqseqid = this.state.reqseqid + 1;
    this.setState({ 
      searchterm,
      filteredList: [],
      reqseqid
     });
    searchresults(searchterm, reqseqid)
      .then(res => {
        let { results, reqseqid } = res;
        if(reqseqid === this.state.reqseqid){
          if(results.length === 0){
            this.setState({ 
              current: -1,
              filteredList: [],
              noresults: true
             });
          }else{
            this.setState({ 
              current: -1,
              filteredList: results,
              noresults: false
            });
          }
        }
       
      });
  
  }

  handleOnSubmit(event) {
    event.preventDefault();
    let searchterm = this.refs.searchterm.value;
    this.setState({ searchterm });
    searchresults(searchterm)
      .then(({ results }) => this.props.submit(results));
  }

  handleClick(item) {
    this.setState({searchterm: item.name})
    this.props.itemClick(item);
  }

  searchplaceholder(){
    if(this.state.noresults){
      return (<div><i>No results</i></div>);
    }else{
      return (<div><i>Searching.....</i></div>);
    }
  }
  
  autocompletelist() {
    return this.state.filteredList.map((c, i) => {
             let { name } = c;
            return (
              <div 
                key={i} 
                onMouseDown={this.handleClick.bind(this, c)}
                className={(this.state.current === i) ? 'autocomplete-active' : 'noclass'}
              >
                <strong>{name.slice(0, this.state.searchterm.length)}</strong>
                {name.slice(this.state.searchterm.length, name.length)}
              </div>
            );
          });

  }

  suggestions(){
    return (
      <div className="autocomplete-items">
        {(this.state.filteredList.length === 0) ? this.searchplaceholder() : this.autocompletelist() }
      </div>
    );
  }

  render() {
    return (
      
        <div className="autocomplete pr-0 pl-0 mr-0 ml-0">
          <form onSubmit={this.handleOnSubmit.bind(this)} className="form-inline mr-0 ml-0">
              <input 
                className="form-control searchbox-input" 
                type="text" 
                value={this.state.searchterm}
                placeholder="Search" 
                aria-label="Search" 
                onInput={this.handleInput.bind(this)}
                onKeyDown={this.handleOnKeyDown.bind(this)}
                onBlur={() => this.setState({ isfocused: false })}
                onFocus={() => this.setState({ isfocused: true })}
                ref="searchterm"
              />
              <button 
                className="btn searchbox-button" 
                type="submit"
              >
                <i className="fa fa-search" aria-hidden="true" />
              </button>
          </form>
         { (this.state.searchterm !== '' && this.state.isfocused) ? this.suggestions() : ''}
        </div>
        
    );
  }
}

export default PeopleSearchBar;
