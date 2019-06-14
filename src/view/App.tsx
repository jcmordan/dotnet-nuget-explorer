import * as React from "react";
import { Layout, Menu, Icon } from 'antd';
import "antd/dist/antd.css";

const { Sider, Header, Content } = Layout;


declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();

interface State {
    collapsed: boolean;
}

// Do stuff with api like getting the state
export default class App extends React.Component<{}, State> {

    public state = {
        collapsed: false
    };

    render() {
        // Display a message box to the user
        vscode.postMessage({ command: 'test' });
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Icon type="user" />
                            <span>nav 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span>nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span>nav 3</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        Content
              </Content>
                </Layout>
            </Layout>
        );
    }

    private toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
}