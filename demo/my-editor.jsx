import React from 'react';
import { message, Layout, Input, Button } from 'antd';

import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Editor from '../src/editor';

import IMAGE_SHAPES from './shape-config/image-shape';
import CARD_SHAPES from './shape-config/card-shape';
import SVG_SHAPES from './shape-config/svg-shape.xml';

import './my-editor.less';
import PropsForm from './Changes/PropsForm';

const { Sider, Content, Footer } = Layout;

class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      customShapeProps: undefined,
      graphShapeProps: undefined,
      showProps: false,
      selectedShapeName: undefined,
      cell: undefined,
    };

    this.graphContainerClickCount = 0;
  }

  componentDidMount() {
    this.mounted = true;

    const editor = new Editor({
      container: '.graph-content',
      clickFunc: this.clickFunc,
      doubleClickFunc: this.doubleClickFunc,
      autoSaveFunc: this.autoSaveFunc,
      cellCreatedFunc: this.cellCreatedFunc,
      deleteFunc: this.deleteFunc,
      undoFunc: this.undoFunc,
      copyFunc: this.copyFunc,
      valueChangeFunc: this.valueChangeFunc,
      IMAGE_SHAPES,
      CARD_SHAPES,
      SVG_SHAPES
    });

    this.editor = editor;

    window.editor = editor;

    editor.initCustomPort('https://gw.alicdn.com/tfs/TB1PqwZzzDpK1RjSZFrXXa78VXa-200-200.png');

    const xml = '<mxGraphModel grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="0" fold="1" page="0" pageScale="1.5" pageWidth="827" pageHeight="1169"><root><mxCell id="klh07h3q"/><mxCell id="klh07h3r" parent="klh07h3q"/><mxCell id="cell1614023984761" value="rectangle" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="klh07h3r" shapeName="Rectangle"><mxGeometry x="120" y="80" width="120" height="60" as="geometry"/></mxCell><mxCell id="cell1614023984762" value="circle" style="shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="klh07h3r" shapeName="Circle"><mxGeometry x="140" y="220" width="80" height="80" as="geometry"/></mxCell><mxCell id="klh07o17" style="exitX=0;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="klh07h3r" source="cell1614023984761" target="cell1614023984762"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="klh07ugl" style="exitX=1;exitY=0.5;entryX=0.75;entryY=1;" edge="1" parent="klh07h3r" source="cell1614023984762" target="cell1614023984761"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';

    this.editor.renderGraphFromXml(xml);

    this.setState({ editor });
  }

  componentWillUnmount() {
    this.mounted = false;

    // remove event listeners when component will unmount
    this.editor.removeEventListeners();
  }


  /**
   * double click event callback
   */
  doubleClickFunc = (cell) => {
    console.log('double click', cell);
  };

  cellCreatedFunc = (currentCell) => {
    console.log(currentCell);
    const allCells = this.editor.getAllCells();

    let sameShapeNameCount = 0;
    const { shapeName } = currentCell;

    allCells
      && Object.keys(allCells).forEach((index) => {
        if (allCells[index].shapeName === shapeName) {
          sameShapeNameCount += 1;
        }
      });

    const labelName = currentCell.value;
    const customProps = currentCell.customProps;

    this.editor.renameCell(`${labelName}${sameShapeNameCount}`, currentCell);
    if (customProps) {
      Object.keys(customProps).forEach((key) => this.editor.updateStyle(currentCell, key, customProps[key]));
    }
    
  };

  deleteFunc = (cells) => {
    console.log('cells deleted: ', cells);
  };

  /**
   * value change callback
   * @param {*} cell cell
   * @param {*} newValue new value
   */
  valueChangeFunc = (cell, newValue) => {
    console.log(`new value: ${newValue}`);
  };

  autoSaveFunc = (xml) => {
    window.autosaveXml = xml;

    const oParser = new DOMParser (); // eslint-disable-line
    const oDOM = oParser.parseFromString(xml, 'application/xml');

    window.autoSaveXmlDom = oDOM;

    window.localStorage.setItem('autosaveXml', xml);
  };

  clickFunc = (cell) => {
    console.log('click', cell);
    const show = cell ? true : false;
    const shapeName = cell ? cell.value : undefined;
    this.setState({showProps: show, selectedShapeName: shapeName, cell});
  };

  undoFunc = (histories) => {
    console.log('undo', histories);
  }

  copyFunc = (cells) => {
    console.log('copy', cells);
  }

  updateDiagramData = (data) => {
    console.log(`update diagram: ${data}`);

    message.info('diagram save success');
  }

  updateProps = (cell, values) => {
    if (values) {
      Object.keys(values).forEach((k) => {
        this.editor.updateStyle(cell, k, values[k]);
        cell.customProps[k] = values[k];
      });
    }
  }

  render() {
    const { editor } = this.state;

    return (
      <div className="editor-container">
        <Layout>
          <Sider width="235" theme="light">
            <Sidebar key="sidebar" editor={editor} />
          </Sider>
          <Content>
            <div className="graph-inner-container">
              {editor ? (
                <Toolbar
                  editor={editor}
                  updateDiagramData={this.updateDiagramData}
                />
              ) : null}
              <div className="graph-content" key="graphcontent" />
            </div>
          </Content>
          {this.state.showProps && (<Footer>
            <div className="graph-footer">
              <h3>{this.state.selectedShapeName}</h3>
              <PropsForm cell={this.state.cell} handleSet={this.updateProps} />
            </div>
          </Footer>)}
        </Layout>
      </div>
    );
  }
}

export default MyEditor;
