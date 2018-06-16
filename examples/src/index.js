/***  examples/src/index.js ***/

import React, { Component } from 'react';
import { render} from 'react-dom';
import ReactJson from 'react-json-view'
import PeopleSearchBar from '../../src/PeopleSearchBar';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            results: [],
            result: {}
        }
    }

    handleClick(result) {
        this.setState({ result });
      }
    
      handleEnter(result) {
        this.setState({ result });        
      }
    
      handleSubmit(results) {
        this.setState({ results });        
      }

    render(){
        return(
            <div className="container">
                <h1>People Search Bar</h1>
                <h4>Search for People using dbpedia database</h4>
                <br />
                <p>
                    use:  <em> npm install react-people-search-bar  to install </em>
                    <br/>
                    <br/>
                    <em> import PeopleSearchBar from 'react-people-search-bar'; </em>
                    <br/>
                    <br/>
                    <b>Props:</b>
                    <ol>
                        <li>
                            itemClick()
                            params: item object of the entry selected.
                        </li>
                        <li>
                            itemEnter()
                            params: item object of the entry selected throw the use of up and down arrows and then enter is pressed.
                        </li>
                        <li>
                            submit()
                            params: Array of search results of the text entered when search button is pressed.
                        </li>

                    </ol>
                </p>

                <div className="col-md-6">
                    <PeopleSearchBar 
                        itemClick={this.handleClick.bind(this)}
                        itemEnter={this.handleEnter.bind(this)}
                        submit={this.handleSubmit.bind(this)}
                    />
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <em> Click on any of the search entries or choose them using up and down arrow key then press Enter.</em>
                        <ReactJson src={this.state.result} />
                    </div>
                    <div className="col-md-6">
                        <em>
                            Press <i className="fa fa-search" aria-hidden="true" /> to get Search results
                        </em>
                        <ReactJson src={this.state.results} />
                    </div>
                    
                </div>
            </div>
        );
    }

}
    


render(<App />, document.getElementById("root"));