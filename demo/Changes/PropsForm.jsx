import { Button, Form, Input } from 'antd';
import React from 'react';

class PropsForm extends React.Component {
  constructor(props) {
    super(props);

    this.clickButton = this.clickButton.bind(this);
  }

  clickButton (values) {
    console.log(values);
    if (this.props.handleSet) {
      this.props.handleSet(this.props.cell, values);
    }
  }

  render() {
    return (
      <div>
        <Form name="teste" onFinish={this.clickButton} initialValues={this.props.cell.customProps}>
          {this.props.cell.customProps && 
            Object.keys(this.props.cell.customProps).map((cp) => (<Form.Item key={cp} name={cp} label={cp}><Input /></Form.Item>))}
          <Form.Item>
            <Button type="primary" htmlType="submit">Set</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
 
export default PropsForm;