import * as React from "react";
import Axios from 'axios';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { PackageList } from "./components/PackageList";
import PackageDetails from "./components/PackageDetail";
// import { Button } from "antd/lib/radio";

const { Sider, Header, Content } = Layout;

let vscode = {
    postMessage: (data: any) => console.log('vscode api not available')
};

declare var acquireVsCodeApi: any;

try {
    vscode = acquireVsCodeApi();
} catch (error) {

}
export interface Version {
    version: string;
    downloads: number;
    button:any
}

export interface Package {
    id: string;
    version: string;
    iconUrl: string;
    title: string;
    description: string;
    summary: string;
    authors: Array<string>;
    versions:Array<Version>
}

interface State {
    collapsed: boolean;
    packages: Package[];
    error?: any;
    includePreRelease: boolean;
    loading: boolean;
    selectedPackage: Package | undefined;
}


const nugetApiUrl = 'https://api-v2v3search-0.nuget.org/query'
// Do stuff with api like getting the state
export default class App extends React.Component<{}, State> {

    public state = {
        collapsed: false,
        includePreRelease: false,
        packages: [
            // {
            //     id: "NUnit",
            //     version: "3.12.0",
            //     description: "NUnit features a fluent assert syntax, parameterized, generic and theory tests and is user-extensible.\n\nThis package includes the NUnit 3 framework assembly, which is referenced by your tests. You will need to install version 3 of the nunit3-console program or a third-party runner that supports NUnit 3 in order to execute tests. Runners intended for use with NUnit 2.x will not run NUnit 3 tests correctly.\n\nSupported platforms:\n- .NET Framework 3.5+\n- .NET Standard 1.4+\n- .NET Core",
            //     iconUrl: "https://cdn.rawgit.com/nunit/resources/master/images/icon/nunit_256.png",
            //     title: "NUnit",
            //     summary:""
            // }
        ],
        loading: true,
        selectedPackage: undefined
    };


    constructor() {
        super({});
        this.loadPackages();
    }

    render() {
        // Display a message box to the user
        vscode.postMessage({ command: 'test' });
        const { includePreRelease, packages, loading } = this.state;
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
                            <Col span="12">
                                <PackageList
                                    packages={packages}
                                    includePreRelease={includePreRelease}
                                    toggleIncludePreRelease={this.toggleIncludePreRelease}
                                    loadPackages={this.loadPackages}
                                    onInfiniteScroll={this.handleInfiniteOnLoad}
                                    loadMore={true}
                                    loading={loading}
                                    onSelect={this.onSelectPackage}
                                />
                            </Col>
                            <Col span="12">
                                <PackageDetails packageDetail={this.state.selectedPackage}></PackageDetails>
                            </Col>
                        </Row>

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

    private loadPackages = (criteria?: string | React.ChangeEvent<HTMLInputElement>) => {
        let uri = nugetApiUrl;
        if (criteria) {
            const searchValue = typeof criteria === 'string' ? criteria : (criteria as React.ChangeEvent<HTMLInputElement>).target.value;
            uri = `${nugetApiUrl}?q=${searchValue}`;
        }

        this.setState({
            loading: true
        });

        Axios.get(uri)
            .then(response => {

                const items: Package[] = response.data.data;
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
            loading: true,
        });
    }

    onSelectPackage = (item: Package) => {
        this.setState({
            selectedPackage: item
        });
    }
}