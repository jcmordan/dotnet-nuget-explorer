import * as React from "react";
import {
    Input,
    Switch,
    Card,
    List,
    Avatar
} from 'antd';
import { Package } from "../App";
import * as InfiniteScroll from 'react-infinite-scroller';

const Search = Input.Search;

interface Props {
    includePreRelease: boolean;
    packages: Package[];
    loadMore: boolean;
    loading: boolean;
    selected: Package | undefined;
    loadPackages: (criteria?: string | React.ChangeEvent<HTMLInputElement>) => void;
    toggleIncludePreRelease: (include: boolean) => void;
    onInfiniteScroll: () => void;
    onSelect: (item: Package) => void;
}

interface State {
    selected: Package | undefined;
}

export class PackageList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selected: props.selected
        };
    }

    public render() {
        const {
            loadPackages,
            includePreRelease,
            toggleIncludePreRelease,
            packages,
            onInfiniteScroll,
            loadMore,
            loading
        } = this.props;

        return (
            <>
                <Card
                    // loading={loading}
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

                    <div className="infinite-container">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={onInfiniteScroll}
                            hasMore={!loading && loadMore}
                            useWindow={false}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={packages}
                                renderItem={(item: Package) => (
                                    <List.Item
                                        className={this.getClass(item)}
                                        key={item.id}
                                        onClick={() => this.onSelect(item)}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src={item.iconUrl} />
                                            }
                                            title={item.title}
                                            description={item.description.split('\n')[0]}
                                        />
                                    </List.Item>
                                )}
                            />,
                    </InfiniteScroll>
                    </div>
                </Card>
            </>
        );
    }

    private onSelect = (item: Package) => {
        this.setState({
            selected: item
        }, () => this.props.onSelect(item));
    }

    private getClass = (item: Package) => {
        if (!this.state.selected) {
            return '';
        }

        return this.state.selected.id === item.id ? 'active' : '';
    }
}