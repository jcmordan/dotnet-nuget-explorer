import * as React from "react";
import Axios from 'axios';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { PackageList } from "./components/PackageList";
import PackageDetails from "./components/PackageDetail";
import { setTimeout } from "timers";
// import { Button } from "antd/lib/radio";

const { Sider, Header, Content } = Layout;

// let vscode = {
//     postMessage: (data: any) => console.log('vscode api not available'),
//     workspace: {},
//     options: {}
// };

declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();
// try {
//     const vscode = acquireVsCodeApi();
// } catch (error) {

// }

export interface Package {
    id: string;
    version: string;
    iconUrl: string;
    title: string;
    description: string;
    summary: string;
}

interface State {
    collapsed: boolean;
    packages: Package[];
    error?: any;
    includePreRelease: boolean;
    loading: boolean;
    selectedPackage: Package | undefined;
    skip: number;
}

interface Props {
    defaultItems: number;
}

const nugetApiUrl = 'https://api-v2v3search-0.nuget.org/query';

export default class App extends React.Component<Props, State> {

    public state = {
        collapsed: false,
        includePreRelease: false,
        packages: [],
        loading: true,
        selectedPackage: undefined,
        skip: 0
    };

    constructor(props: Props) {
        super(props);
        setTimeout(() => { this.loadPackages(); }, 200);
    }

    render() {
        console.log({ vscode });
        vscode.postMessage({ command: 'test' });

        vscode.onDidReceiveMessage(console.log);

        const { includePreRelease, packages, loading, selectedPackage } = this.state;
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
                <Layout style={{
                    minHeight: '100vh',
                }}>
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
                            background: 'rgb(236, 236, 236)',
                            minHeight: 280,
                        }}
                    >
                        <Row>
                            <Col span={12}>
                                <PackageList
                                    packages={packages}
                                    includePreRelease={includePreRelease}
                                    toggleIncludePreRelease={this.toggleIncludePreRelease}
                                    loadPackages={this.loadPackages}
                                    loadMore={true}
                                    loading={loading}
                                    selected={selectedPackage}
                                    onInfiniteScroll={this.handleInfiniteOnLoad}
                                    onSelect={this.onSelectPackage}
                                />
                            </Col>
                            <Col span={12}>
                                <PackageDetails></PackageDetails>
                            </Col>
                        </Row>

                        <pre>{JSON.stringify(vscode, null, 2)}</pre>
                    </Content>
                </Layout>
            </Layout >
        );
    }

    private toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    private toggleIncludePreRelease = (include: boolean) => {
        this.setState({
            includePreRelease: include
        });
    }

    private loadPackages = (criteria?: string | React.ChangeEvent<HTMLInputElement>, apendResult: boolean = false) => {
        const { includePreRelease, skip, packages } = this.state;

        let uri = `${nugetApiUrl}?take=${this.props.defaultItems}`;
        if (criteria) {
            const searchValue = typeof criteria === 'string' ? criteria : (criteria as React.ChangeEvent<HTMLInputElement>).target.value;
            uri = `${nugetApiUrl}?q=${searchValue}`;
        }

        if (apendResult) {
            uri += `&skip=${skip}`;
        }

        uri += `&prerelease=${includePreRelease}`;

        this.setState({
            loading: true
        });

        Axios.get(uri)
            .then(response => {
                const items: Package[] = apendResult ? packages.concat(response.data.data) : response.data.data;

                this.setState({
                    packages: items,
                    loading: false,
                    selectedPackage: items[0]
                });
            })
            .catch(error => {
                this.setState({
                    error,
                    loading: false
                });
            });
    }

    private handleInfiniteOnLoad = () => {
        this.setState({
            skip: this.state.skip + this.props.defaultItems
        }, () => this.loadPackages(undefined, true));
    }

    onSelectPackage = (item: Package) => {
        this.setState({
            selectedPackage: item
        });
    }
}