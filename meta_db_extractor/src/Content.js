import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap';
import logo from './logo.svg';
import './Content.css'
// import 'json';
// import { handleSQLitePublish } from './db_work';
// import sql from 'sql.js';

var response_meta_data = '';

class Content extends Component {
    // componentDidMount() {
    //     console.log(new sql.Database());
    // }
    constructor(props) {
        super(props);
        this.state = {
            meta_data: '',
            input_dbname: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSQLitePublish = this.handleSQLitePublish.bind(this);
        this.handleMongoDBPublish = this.handleMongoDBPublish.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit(event) {
        var sum = parseInt(this.state.input_dbname) + parseInt(this.state.input_2)
        this.setState({
            meta_data: sum
        });
        event.preventDefault();
    }
    handleClear() {
        this.setState({
            meta_data: '',
            input_dbname: '',
        });
    }
    handleSQLitePublish() {
        var url = 'http://127.0.0.1:5000/Extract_SQLite_Meta/' + this.state.input_dbname;
        $.get(url, {}, function (data, status) {
            var str = JSON.stringify(data, undefined, 4);
            console.log(str);
            $("#response_code").text(str);
            $('#insertion-result').text(data);
            $('#resultModal').modal('show');
            setTimeout(function () {
                $("#resultModal").modal('hide');
            }, 5000);
        });
    }
    handleMongoDBPublish() {
        var url = 'http://127.0.0.1:5000/Extract_MongoDB_Meta/' + this.state.input_dbname;
        $.get(url, {}, function (data, status) {
            console.log(data);
            console.log(status);
            $("#response_code").text(data);
            response_meta_data = data;
            $('#insertion-result').text(data);
            $('#resultModal').modal('show');
            setTimeout(function () {
                $("#resultModal").modal('hide');
            }, 5000);
        });
    }
    render() {
        return (
            <div>
                <div className="container mt-5">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Database name</span>
                                    </div>
                                    <input type="text" name="input_dbname" value={this.state.input_dbname} className="form-control" placeholder="Database Name" aria-label="Input 1" aria-describedby="basic-addon1" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-5"></div>
                            <div className="col-sm-2">
                                <div className="btn-group" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-danger" onClick={this.handleClear}>Clear</button>
                                    <button type="submit" className="btn btn-success">Process</button>
                                </div>
                            </div>
                            <div className="col-sm-5"></div>
                        </div>
                    </form>
                </div>
                <footer className="fixed-bottom bg-black fixed-height-40">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="row">
                                <div className="terminal-heading col-sm-12">
                                    <h3>Output</h3>
                                </div>
                                <div className="terminal-output col-sm-12">
                                    &#123;
                                    <div className="ml-4" id='response_code'></div>
                                    &#125;
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 center-align">
                            <div className="row backg-yellow">
                                <h3>Fetch Meta Data</h3>
                            </div>
                            <div className="row mt-4">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4">
                                    <div className="btn-group-vertical" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-info btn-lg" onClick={this.handleSQLitePublish} >SQLite</button>
                                        <button type="button" className="btn btn-success btn-lg" onClick={this.handleMongoDBPublish} >MongoDB</button>
                                    </div>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="modal fade" id="resultModal" tabIndex="-1" role="dialog" aria-labelledby="resultModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Result</h5>
                            </div>
                            <div className="modal-body" id="insertion-result">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
