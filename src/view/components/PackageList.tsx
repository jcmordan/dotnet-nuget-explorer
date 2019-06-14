import * as React from "react";
import {
    Input,
    Switch,
    Card,
    List,
    Avatar
} from 'antd';
import { Package } from "../App";
const Search = Input.Search;

interface Props {
    loadPackages: (criteria?: string | React.ChangeEvent<HTMLInputElement>) => void;
    includePreRelease: boolean;
    toggleIncludePreRelease: (include: boolean) => void;
    packages: Package[];
}

export class PackageList extends React.Component<Props> {
    public render() {
        const { loadPackages, includePreRelease, toggleIncludePreRelease, packages } = this.props;
        return (
            <>
                <Card
                    bordered={false}
                    extra={
                        <>
                            <Search
                                placeholder="Search packages"
                                onChange={loadPackages}
                                onSearch={loadPackages}
                                style={{ width: 200, marginRight: 10 }}
                            />
                            <label>Include prerelease?</label>
                            <Switch
                                size="small"
                                style={{
                                    marginLeft: 5
                                }}
                                checked={includePreRelease}
                                onChange={toggleIncludePreRelease} />
                        </>
                    }>
                    <List
                        itemLayout="horizontal"
                        dataSource={packages}
                        renderItem={(item: Package) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.iconUrl} />}
                                    title={item.title}
                                    description={item.summary}
                                />
                            </List.Item>
                        )}
                    />,
                </Card>
            </>
        );
    }
}