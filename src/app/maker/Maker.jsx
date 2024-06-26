"use client"
import React, { Component } from 'react';
import {
  Row, Col, Button, Container,
  TabContent, TabPane,
  Nav, NavItem, NavLink
 } from 'reactstrap';
// import ReactJson from 'react-json-view';

import {
  Canvas,
  Palette,
  state,
  Trash,
  core,
  Preview,
  registerPaletteElements
} from 'react-page-maker';

import { elements } from './const';
import DraggableTextbox from './elements/DraggableTextbox';
import DraggableHeader from './elements/DraggableHeader';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // register all palette elements
    registerPaletteElements([{
      type: elements.TEXTBOX,
      component: DraggableTextbox
    },{
      type: elements.HEADER,
      component: DraggableHeader
    }]);

    // state.clearState() triggers this event
    state.addEventListener('flush', (e) => {
      console.log('flush', e);
    });

    // state.removeElement() triggers this event
    state.addEventListener('removeElement', (e) => {
      console.log('removeElement', e);
    });

    // state.updateElement() triggers this event
    state.addEventListener('updateElement', (e) => {
      console.log('updateElement', e);
    });
  }

  state = {
    activeTab: '1',
    currentState: []
  }

  UNSAFE_componentWillMount() {
    state.addEventListener('change', this._stateChange);
  }

  UNSAFE_componentWillMount() {
    state.removeEventListener('change', this._stateChange);
  }

  _stateChange = (s) => {
    const newState = state.getStorableState();
    this.setState({ currentState: newState }, () => {
      localStorage.setItem('initialElements', JSON.stringify(newState));
    });
  }

  // re-hydrate canvas state
  initialElements = JSON.parse(localStorage.getItem('initialElements'))

  // define all palette elements that you want to show
  paletteItemsToBeRendered = [{
    type: elements.TEXTBOX,
    name: 'Text Field',
    id: 'f1',
    payload: { // initial data
      fname: 'Pravin',
      lname: 'Sawant'
    }
  }, {
    type: elements.HEADER,
    name: 'Header',
    id: 'h1'
  }]

  _onDrop = (data, cb) => {
    // no need to ask id and name again
    if (data.payload && data.payload.dropped) {
      return cb(data);
    }

    let name = data.name;

    if (data.type === elements.TEXTBOX || data.type === elements.DROPDOWN) {
      name = window.prompt('Enter name of field');
    }

    const id = window.prompt('Please enter unique ID');

    const result = cb({
      ...data,
      name,
      id,
      payload: { dropped: true }
    });
  }

  _toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  _clearState = () => {
    state.clearState();
  }

  render() {
    return (
      <div className="App container">
        <Nav tabs className="justify-content-md-center">
          <NavItem>
            <NavLink
              className={`${this.state.activeTab === '1' ? 'active' : ''}`}
              onClick={() => { this._toggleTab('1'); }}
            >
              Canvas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${this.state.activeTab === '2' ? 'active' : ''}`}
              onClick={() => { this._toggleTab('2'); }}
            >
              Preview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${this.state.activeTab === '3' ? 'active' : ''}`}
              onClick={() => { this._toggleTab('3'); }}
            >
              JSON
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row className="page-builder mt-3">
              <Col sm="9" className="canvas-container">
                <Canvas onDrop={this._onDrop} initialElements={this.initialElements} placeholder="Drop Here" />
              </Col>
              <Col sm="3">
                <Palette paletteElements={this.paletteItemsToBeRendered} />
                <Trash />
                <Button color="danger" onClick={this._clearState}>Flush Canvas</Button>
              </Col>
              <p className="m-4"><sup>*</sup>All canvas data is getting stored in localStorage. Try refresh, canvas will get pre-populate with previous state</p>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="mt-3">
              <Preview>
                {
                  ({ children }) => (
                    <Container>
                      {children}
                    </Container>
                  )
                }
              </Preview>
            </Row>
          </TabPane>
          {/* <TabPane tabId="3">
            <Row className="mt-3">
              <Col sm="12">
                <ReactJson src={this.state.currentState} collapsed theme="solarized" />
              </Col>
            </Row>
          </TabPane> */}
        </TabContent>
      </div>
    );
  }
}

export default App;
